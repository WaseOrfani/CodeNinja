import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await api.getProduct(id);
        setProduct(productData);
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Produkt nicht gefunden');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const calculateTotal = () => {
    if (!selectedVariant) return 0;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return (selectedVariant.price + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Bitte wähle eine Variante');
      return;
    }
    addItem(product, selectedVariant, selectedExtras, quantity);
    toast.success(`${product.name} zum Warenkorb hinzugefügt`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded mb-6" />
          <div className="aspect-video bg-slate-200 rounded-2xl mb-6" />
          <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-full bg-slate-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 animate-slide-up">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        data-testid="product-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            {product.is_bestseller && (
              <Badge className="bg-orange-500 text-white">Bestseller</Badge>
            )}
{/* Halal badge removed */}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {product.name}
          </h1>
          
          <p className="text-slate-500 mt-3 text-lg">{product.description}</p>

          {/* Allergens */}
          {product.allergens && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Allergene</p>
                <p className="text-sm text-amber-700">{product.allergens}</p>
              </div>
            </div>
          )}

          {/* Variants */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-3">Variante wählen</h3>
            <div className="space-y-2">
              {product.variants.map((variant, index) => {
                const isMenu = variant.name.includes('MENÜ') || variant.name.includes('Menü');
                const isSelected = selectedVariant?.name === variant.name;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : isMenu 
                          ? 'border-orange-200 bg-orange-50/50 hover:border-orange-300'
                          : 'border-slate-200 hover:border-slate-300'
                    }`}
                    data-testid={`variant-${variant.name}`}
                  >
                    {isMenu && (
                      <span className="absolute -top-2 right-3 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        EMPFOHLEN
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-medium ${isMenu ? 'text-orange-900' : 'text-slate-900'}`}>
                          {variant.name}
                        </span>
                        {variant.includes && (
                          <p className="text-sm text-slate-500 mt-0.5">{variant.includes}</p>
                        )}
                      </div>
                      <span className={`font-bold ${isMenu ? 'text-orange-600' : 'text-green-600'}`}>
                        €{variant.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Extras hinzufügen</h3>
              <div className="space-y-2">
                {product.extras.map((extra) => (
                  <label
                    key={extra.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedExtras.find(e => e.id === extra.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    data-testid={`extra-${extra.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={!!selectedExtras.find(e => e.id === extra.id)}
                        onCheckedChange={() => toggleExtra(extra)}
                      />
                      <span className="font-medium text-slate-900">{extra.name}</span>
                    </div>
                    <span className="text-green-600 font-medium">+€{extra.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-3">Menge</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                data-testid="quantity-minus"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-slate-900 w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                data-testid="quantity-plus"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">Gesamtpreis</span>
              <span className="text-2xl font-bold text-slate-900">€{calculateTotal().toFixed(2)}</span>
            </div>
            <Button 
              onClick={handleAddToCart}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20"
              data-testid="add-to-cart-btn"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              In den Warenkorb
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
