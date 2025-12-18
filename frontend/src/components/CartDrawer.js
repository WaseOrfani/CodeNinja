import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <ShoppingBag className="w-5 h-5" />
            Warenkorb ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" strokeWidth={1} />
            <p className="text-slate-500 mb-4">Dein Warenkorb ist leer</p>
            <Button 
              onClick={() => { onClose(); navigate('/shop'); }}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
              data-testid="cart-empty-shop-btn"
            >
              Jetzt bestellen
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3 p-3 bg-slate-50 rounded-xl"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <img 
                    src={item.product_image} 
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{item.product_name}</h4>
                    <p className="text-sm text-slate-500">{item.variant}</p>
                    {item.extras.length > 0 && (
                      <p className="text-xs text-slate-400 truncate">
                        + {item.extras.map(e => e.name).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          data-testid={`cart-item-minus-${item.product_id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium text-slate-900 w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          data-testid={`cart-item-plus-${item.product_id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-green-600">€{item.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors self-start"
                    data-testid={`cart-item-remove-${item.product_id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Zwischensumme</span>
                <span className="font-bold text-xl text-slate-900">€{cartTotal.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20"
                data-testid="cart-checkout-btn"
              >
                Zur Kasse
              </Button>
              
              <button 
                onClick={clearCart}
                className="w-full text-center text-sm text-slate-400 hover:text-red-500 transition-colors"
                data-testid="cart-clear-btn"
              >
                Warenkorb leeren
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
