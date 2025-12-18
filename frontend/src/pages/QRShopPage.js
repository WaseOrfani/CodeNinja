import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { ProductCard } from '../components/ProductCard';
import { Badge } from '../components/ui/badge';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, X } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QRShopPage() {
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if in QR mode
  useEffect(() => {
    const isQRMode = sessionStorage.getItem('oria-qr-mode');
    if (!isQRMode) {
      // Not from QR - redirect to normal shop
      navigate('/shop', { replace: true });
      return;
    }
  }, [navigate]);

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

  // Sort: Featured → Bestseller → Menü variants prioritized
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Featured first, then Bestseller, then has Menü variant
      const aScore = (a.is_featured ? 1000 : 0) + (a.is_bestseller ? 100 : 0) + 
                     (a.variants?.some(v => v.name?.toLowerCase().includes('menü')) ? 10 : 0);
      const bScore = (b.is_featured ? 1000 : 0) + (b.is_bestseller ? 100 : 0) + 
                     (b.variants?.some(v => v.name?.toLowerCase().includes('menü')) ? 10 : 0);
      return bScore - aScore;
    });

  const tableNumber = sessionStorage.getItem('oria-table');

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* QR Header - Minimal */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tighter text-slate-900">ORIA</span>
            <span className="text-lg font-black tracking-tighter text-green-500">FRESH</span>
            {tableNumber && (
              <Badge className="bg-purple-100 text-purple-700 ml-2">Tisch {tableNumber}</Badge>
            )}
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            data-testid="qr-cart-button"
          >
            <ShoppingBag className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Quick Headline */}
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Jetzt bestellen</h1>
        <p className="text-slate-500 text-sm mb-4">Schnell & frisch zubereitet</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full border-slate-200 bg-slate-50 text-sm"
            data-testid="qr-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills - Compact */}
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedCategory === 'all' 
                ? 'bg-green-500 text-white font-medium' 
                : 'bg-slate-100 text-slate-600'
            }`}
            data-testid="qr-category-all"
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.name 
                  ? 'bg-green-500 text-white font-medium' 
                  : 'bg-slate-100 text-slate-600'
              }`}
              data-testid={`qr-category-${category.slug}`}
            >
              <span className="text-xs">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <QRProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg z-50">
          <Link to="/qr/checkout">
            <button 
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              data-testid="qr-checkout-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              Zur Kasse ({cartCount})
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Compact Product Card for QR Mode
function QRProductCard({ product }) {
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const hasMenu = product.variants?.some(v => v.name?.toLowerCase().includes('menü'));
  
  return (
    <Link 
      to={`/qr/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-green-200 transition-all"
      data-testid={`qr-product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-slate-100 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge className="bg-purple-600 text-white text-[9px] px-1.5 py-0.5">NEU</Badge>
          )}
          {product.is_bestseller && !product.is_featured && (
            <Badge className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5">TOP</Badge>
          )}
          {hasMenu && (
            <Badge className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5">MENÜ</Badge>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-green-600 text-sm">ab €{lowestPrice.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
