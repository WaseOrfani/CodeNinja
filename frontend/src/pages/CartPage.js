import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-slide-up">
        <ShoppingBag className="w-20 h-20 text-slate-200 mx-auto mb-6" strokeWidth={1} />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dein Warenkorb ist leer</h1>
        <p className="text-slate-500 mb-8">Füge leckere Speisen hinzu!</p>
        <Link to="/shop">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8"
            data-testid="cart-empty-shop-btn"
          >
            Zur Speisekarte
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Warenkorb
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100"
              data-testid={`cart-page-item-${item.product_id}`}
            >
              <img 
                src={item.product_image} 
                alt={item.product_name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{item.product_name}</h3>
                <p className="text-sm text-slate-500">{item.variant}</p>
                {item.variant_includes && (
                  <p className="text-xs text-slate-400">{item.variant_includes}</p>
                )}
                {item.extras.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    + {item.extras.map(e => e.name).join(', ')}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      data-testid={`cart-page-minus-${item.product_id}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-medium text-slate-900 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      data-testid={`cart-page-plus-${item.product_id}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-green-600 text-lg">€{item.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors self-start"
                data-testid={`cart-page-remove-${item.product_id}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-slate-400 hover:text-red-500 transition-colors"
            data-testid="cart-page-clear-btn"
          >
            Warenkorb leeren
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-slate-900 mb-4">Zusammenfassung</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Zwischensumme</span>
                <span className="text-slate-900">€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Abholung</span>
                <span className="text-green-600">Kostenlos</span>
              </div>
            </div>

            <div className="border-t border-slate-200 my-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Gesamt</span>
                <span className="text-2xl font-bold text-slate-900">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button 
                className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20"
                data-testid="cart-page-checkout-btn"
              >
                Zur Kasse
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link to="/shop" className="block mt-4 text-center text-sm text-green-600 hover:text-green-700">
              Weiter einkaufen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
