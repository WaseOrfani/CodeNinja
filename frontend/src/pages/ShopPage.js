import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/api';

const curatedCategories = [
  { slug: 'holzkohlegrill', name: 'Holzkohlegrill', icon: '🔥', keywords: ['grill', 'spieß', 'kebab', 'bbq', 'fleisch'] },
  { slug: 'tandoor-spezialitaeten', name: 'Tandoor Spezialitäten', icon: '🫓', keywords: ['tandoor', 'ofen', 'brot'] },
  { slug: 'doener-dueruem', name: 'Döner & Dürüm', icon: '🥙', keywords: ['döner', 'duerum', 'dürüm', 'kebab', 'wrap'] },
  { slug: 'pizza-aus-dem-ofen', name: 'Pizza aus dem Ofen', icon: '🍕', keywords: ['pizza'] },
  { slug: 'afghanische-kueche', name: 'Afghanische Küche', icon: '🍛', keywords: ['afghan'] },
  { slug: 'persische-kueche', name: 'Persische Küche', icon: '🍢', keywords: ['persisch', 'iran'] },
  { slug: 'arabische-spezialitaeten', name: 'Arabische Spezialitäten', icon: '🥘', keywords: ['arab', 'shawarma', 'hummus', 'falafel'] },
  { slug: 'salate-vorspeisen', name: 'Salate & Vorspeisen', icon: '🥗', keywords: ['salat', 'vorspeise', 'mezze'] },
  { slug: 'familienplatten', name: 'Familienplatten', icon: '🍽️', keywords: ['familie', 'platte', 'mix'] },
  { slug: 'getraenke', name: 'Getränke', icon: '🥤', keywords: ['cola', 'fanta', 'sprite', 'wasser', 'ayran', 'getränk'] },
  { slug: 'grill-tandoor', name: 'Grill & Tandoor', icon: '🔥', keywords: ['grill', 'tandoor', 'spieß', 'bbq'] },
  { slug: 'mittagstisch', name: 'Mittagstisch', icon: '☀️', keywords: ['menü', 'menu', 'lunch', 'mittags'] }
];

function categoryMatch(product, categorySlug) {
  if (categorySlug === 'all') return true;
  const category = curatedCategories.find((c) => c.slug === categorySlug);
  if (!category) return true;
  const haystack = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return category.keywords.some((keyword) => haystack.includes(keyword));
}

export default function ShopPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await api.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam || 'all');
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryMatch(product, selectedCategory);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price));
        if (sortBy === 'price-high') return Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price));
        const aScore = (a.is_featured ? 100 : 0) + (a.is_bestseller ? 10 : 0);
        const bScore = (b.is_featured ? 100 : 0) + (b.is_bestseller ? 10 : 0);
        return bScore - aScore;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${categorySlug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#0b1f3a]">Unsere Speisekarte</h1>
        <p className="text-slate-700 mt-2">Wähle deine Lieblingsgerichte vom Grill, Tandoor oder Ofen.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Suche nach Gerichten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl border-amber-200 bg-amber-50/40 focus:bg-white"
            data-testid="shop-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-amber-200 bg-amber-50/40" data-testid="shop-sort-select">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Empfohlen</SelectItem>
            <SelectItem value="price-low">Preis: Niedrig → Hoch</SelectItem>
            <SelectItem value="price-high">Preis: Hoch → Niedrig</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedCategory === 'all' ? 'bg-[#0b1f3a] text-amber-100 font-medium' : 'bg-white text-slate-700 border border-amber-200 hover:border-amber-500 hover:bg-amber-50'
          }`}
          data-testid="category-all"
        >
          Alle
        </button>
        {curatedCategories.slice(0, 10).map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category.slug ? 'bg-[#0b1f3a] text-amber-100 font-medium' : 'bg-white text-slate-700 border border-amber-200 hover:border-amber-500 hover:bg-amber-50'
            }`}
            data-testid={`category-${category.slug}`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">{filteredProducts.length} Produkte gefunden</p>
        {selectedCategory !== 'all' && (
          <button onClick={() => handleCategoryClick('all')} className="text-sm text-amber-700 hover:text-amber-800 flex items-center gap-1">
            <X className="w-3 h-3" />
            Filter zurücksetzen
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl aspect-[4/3] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">Keine Produkte für diese Auswahl gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
