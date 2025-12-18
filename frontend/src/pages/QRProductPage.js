import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QRProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, cartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Check QR mode
  useEffect(() => {
    const isQRMode = sessionStorage.getItem('oria-qr-mode');
    if (!isQRMode) {
      navigate(`/product/${id}`, { replace: true });
    }
  }, [navigate, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${id}`);
        setProduct(response.data);
        // Default to Menü variant if available, otherwise first
        const menuVariant = response.data.variants.find(v => 
          v.name?.toLowerCase().includes('menü')
        );
        setSelectedVariant(menuVariant || response.data.variants[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/qr/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) return prev.filter(e => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const calculateTotal = () => {
    if (!selectedVariant) return 0;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return (selectedVariant.price + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    // Store QR source for order
    sessionStorage.setItem('oria-order-source', 'qr');
    
    addItem(product, selectedVariant, selectedExtras, quantity);
    toast.success('Hinzugefügt!', { duration: 1500 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) return null;

  const hasMenu = product.variants?.some(v => v.name?.toLowerCase().includes('menü'));

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="px-4 h-12 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-600"
            data-testid="qr-product-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Zurück</span>
          </button>
          <Link to="/qr/checkout" className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          {product.is_featured && (
            <Badge className="bg-purple-600 text-white">⭐ NEU</Badge>
          )}
          {product.is_bestseller && (
            <Badge className="bg-orange-500 text-white">Bestseller</Badge>
          )}
          {product.is_halal && (
            <Badge variant="secondary" className="bg-green-50 text-green-700">Halal</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-slate-500 mt-1 text-sm">{product.description}</p>

        {/* Variants - Highlight Menü */}
        <div className="mt-5">
          <h3 className="font-semibold text-slate-900 mb-2 text-sm">Auswahl</h3>
          <div className="space-y-2">
            {product.variants.map((variant, index) => {
              const isMenu = variant.name?.toLowerCase().includes('menü');
              return (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedVariant?.name === variant.name
                      ? 'border-green-500 bg-green-50'
                      : isMenu 
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-slate-200'
                  }`}
                  data-testid={`qr-variant-${variant.name}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {isMenu && <Star className="w-4 h-4 text-blue-500" />}
                      <span className={`font-medium ${isMenu ? 'text-blue-700' : 'text-slate-900'}`}>
                        {variant.name}
                      </span>
                      {isMenu && (
                        <Badge className="bg-blue-500 text-white text-[10px]">EMPFOHLEN</Badge>
                      )}
                    </div>
                    <span className="font-bold text-green-600">€{variant.price.toFixed(2)}</span>
                  </div>
                  {variant.includes && (
                    <p className="text-xs text-slate-500 mt-1">{variant.includes}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Extras - Prominent */}
        {product.extras && product.extras.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">
              Extras hinzufügen
              <span className="text-green-600 font-normal ml-2">+Mehr Geschmack!</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {product.extras.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedExtras.find(e => e.id === extra.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200'
                  }`}
                  data-testid={`qr-extra-${extra.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{extra.name}</span>
                    <Checkbox 
                      checked={!!selectedExtras.find(e => e.id === extra.id)}
                      className="pointer-events-none"
                    />
                  </div>
                  <span className="text-green-600 text-xs font-medium">+€{extra.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-semibold text-slate-900 text-sm">Menge</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center"
              data-testid="qr-quantity-minus"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center"
              data-testid="qr-quantity-plus"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg">
        <Button 
          onClick={handleAddToCart}
          className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full"
          data-testid="qr-add-to-cart"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Hinzufügen · €{calculateTotal().toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
