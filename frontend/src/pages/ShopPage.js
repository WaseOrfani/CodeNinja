import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ShopPage() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const cat = categories.find(c => c.slug === categoryParam);
      if (cat) setSelectedCategory(cat.name);
    }
  }, [categoryParam, categories]);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Custom sort: Featured first, then Bestsellers, then by selected sort
      if (sortBy === 'price-low') return Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price));
      if (sortBy === 'price-high') return Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price));
      
      // Default: Featured → Bestseller → Rest
      const aScore = (a.is_featured ? 100 : 0) + (a.is_bestseller ? 10 : 0);
      const bScore = (b.is_featured ? 100 : 0) + (b.is_bestseller ? 10 : 0);
      return bScore - aScore;
    });

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'all') {
      navigate('/shop');
    } else {
      const cat = categories.find(c => c.name === categoryName);
      if (cat) navigate(`/shop/${cat.slug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">
          Unsere Speisekarte
        </h1>
        <p className="text-slate-500 mt-2">Wähle deine Lieblingsspeisen</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            type="text"
            placeholder="Suche nach Produkten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
            data-testid="shop-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-slate-200 bg-slate-50" data-testid="shop-sort-select">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Standard</SelectItem>
            <SelectItem value="price-low">Preis: Niedrig → Hoch</SelectItem>
            <SelectItem value="price-high">Preis: Hoch → Niedrig</SelectItem>
            <SelectItem value="bestseller">Bestseller zuerst</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedCategory === 'all' 
              ? 'bg-green-500 text-white font-medium' 
              : 'bg-slate-50 text-slate-600 border border-slate-100 hover:border-green-500 hover:bg-green-50'
          }`}
          data-testid="category-all"
        >
          Alle
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category.name 
                ? 'bg-green-500 text-white font-medium' 
                : 'bg-slate-50 text-slate-600 border border-slate-100 hover:border-green-500 hover:bg-green-50'
            }`}
            data-testid={`category-${category.slug}`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {filteredProducts.length} Produkte gefunden
        </p>
        {selectedCategory !== 'all' && (
          <button 
            onClick={() => handleCategoryClick('all')}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl aspect-[4/3] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">Keine Produkte gefunden</p>
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
