import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { ArrowLeft, Clock, CreditCard, Banknote, Minus, Plus, Trash2, Gift, Sparkles } from 'lucide-react';
import CheckoutUpsell from '../components/CheckoutUpsell';
import api, { apiPost } from '../lib/api';

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb';

export default function QRCheckoutPage() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart, updateQuantity, removeItem } = useCart();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [qrBonus, setQrBonus] = useState(null);
  
  // Minimal form - QR optimized
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    pickup_time: '', // Will be set to next available
    notes: '',
    payment_method: 'pickup'
  });

  // Check QR mode
  useEffect(() => {
    const isQRMode = sessionStorage.getItem('oria-qr-mode');
    if (!isQRMode) {
      navigate('/checkout', { replace: true });
      return;
    }
    
    if (items.length === 0) {
      navigate('/qr/shop');
    }
  }, [items, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await api.getSettings();
        setSettings(settingsData);
        // Set first pickup slot as default
        const slots = settingsData.pickup_slots || ['sofort', '15 min', '30 min'];
        setFormData(prev => ({ ...prev, pickup_time: slots[0] }));
        
        // Check if QR bonus is enabled
        if (settingsData.qr_bonus?.enabled) {
          setQrBonus(settingsData.qr_bonus);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setFormData(prev => ({ ...prev, pickup_time: 'sofort' }));
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      toast.error('Bitte Name eingeben');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      toast.error('Bitte Telefon eingeben');
      return false;
    }
    // Email optional for QR orders
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return null;
    
    try {
      const tableNumber = sessionStorage.getItem('oria-table');
      
      const orderData = {
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          variant: item.variant,
          variant_price: item.variant_price,
          quantity: item.quantity,
          extras: item.extras,
          total: item.total
        })),
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || `qr-${Date.now()}@guest.oriafresh.de`,
        pickup_time: formData.pickup_time,
        notes: tableNumber ? `Tisch ${tableNumber}. ${formData.notes}` : formData.notes,
        payment_method: formData.payment_method,
        subtotal: cartTotal,
        total: cartTotal,
        source: 'qr' // QR tracking flag
      };

      const orderResult = await api.createOrder(orderData);
      return orderResult;
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Fehler bei der Bestellung');
      return null;
    }
  };

  const handlePickupPayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const order = await createOrder();
      if (order) {
        clearCart();
        sessionStorage.removeItem('oria-qr-mode');
        sessionStorage.removeItem('oria-table');
        toast.success('Bestellung aufgegeben!');
        navigate(`/qr/success/${order.order_id}`);
      }
    } catch (error) {
      toast.error('Fehler bei der Bestellung');
    } finally {
      setLoading(false);
    }
  };

  const pickupSlots = settings?.pickup_slots || ['sofort', '15 min', '30 min', '45 min', '60 min'];
  const tableNumber = sessionStorage.getItem('oria-table');

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="px-4 h-12 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-600"
            data-testid="qr-checkout-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Zurück</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Kasse</h1>
        {tableNumber && (
          <p className="text-purple-600 font-medium text-sm mb-4">Tisch {tableNumber}</p>
        )}

        {/* QR Bonus Banner */}
        {qrBonus && (
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white animate-slide-up" data-testid="qr-bonus-banner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{qrBonus.bonus_name}</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-sm text-white/80">🎉 Dein QR-Bonus wird automatisch hinzugefügt!</p>
              </div>
            </div>
          </div>
        )}

        {/* Upsell - only if cart < €25 */}
        <CheckoutUpsell items={items} cartTotal={cartTotal} />

        {/* Cart Items - Compact editable */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="font-semibold text-slate-900 mb-3 text-sm">Deine Bestellung</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{item.product_name}</p>
                  <p className="text-xs text-slate-500">{item.variant}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-bold text-green-600 text-sm w-16 text-right">
                  €{item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
            <span className="font-semibold text-slate-900">Gesamt</span>
            <span className="font-bold text-xl text-green-600">€{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Pickup Time - First */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-green-600" />
            <h2 className="font-semibold text-slate-900 text-sm">Abholzeit</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {pickupSlots.slice(0, 6).map((slot) => (
              <button
                key={slot}
                onClick={() => setFormData(prev => ({ ...prev, pickup_time: slot }))}
                className={`p-3 rounded-lg text-center transition-all ${
                  formData.pickup_time === slot
                    ? 'bg-green-500 text-white font-medium'
                    : 'bg-slate-50 text-slate-700 border border-slate-200'
                }`}
                data-testid={`qr-time-${slot}`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Customer Data */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="font-semibold text-slate-900 mb-3 text-sm">Deine Daten</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-500">Name *</Label>
              <Input 
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                placeholder="Dein Name"
                className="h-11 mt-1"
                data-testid="qr-name-input"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Telefon *</Label>
              <Input 
                name="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={handleInputChange}
                placeholder="Für Rückfragen"
                className="h-11 mt-1"
                data-testid="qr-phone-input"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Anmerkungen</Label>
              <Input 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="z.B. ohne Zwiebeln"
                className="h-11 mt-1"
                data-testid="qr-notes-input"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="font-semibold text-slate-900 mb-3 text-sm">Zahlung</h2>
          <RadioGroup 
            value={formData.payment_method} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            className="space-y-2"
          >
            <label 
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${
                formData.payment_method === 'pickup' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200'
              }`}
            >
              <RadioGroupItem value="pickup" data-testid="qr-pay-pickup" />
              <Banknote className="w-5 h-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900 text-sm">Bei Abholung</p>
                <p className="text-xs text-slate-500">Bar oder Karte</p>
              </div>
            </label>
            
            <label 
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${
                formData.payment_method === 'paypal' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200'
              }`}
            >
              <RadioGroupItem value="paypal" data-testid="qr-pay-paypal" />
              <CreditCard className="w-5 h-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900 text-sm">PayPal</p>
                <p className="text-xs text-slate-500">Jetzt bezahlen</p>
              </div>
            </label>
          </RadioGroup>
        </div>
      </div>

      {/* Fixed Bottom - Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg">
        {formData.payment_method === 'pickup' ? (
          <Button 
            onClick={handlePickupPayment}
            disabled={loading}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full"
            data-testid="qr-submit-order"
          >
            {loading ? 'Wird gesendet...' : `Bestellen · €${cartTotal.toFixed(2)}`}
          </Button>
        ) : (
          <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
            <PayPalButtons
              style={{ layout: 'horizontal', shape: 'pill', height: 55 }}
              disabled={!formData.customer_name || !formData.customer_phone}
              createOrder={async () => {
                if (!validateForm()) return;
                const order = await createOrder();
                if (order?.paypal_order_id) {
                  setOrderId(order.order_id);
                  return order.paypal_order_id;
                }
                throw new Error('Failed to create order');
              }}
              onApprove={async (data) => {
                try {
                  await axios.post(`${API}/orders/${orderId}/capture?paypal_order_id=${data.orderID}`);
                  clearCart();
                  sessionStorage.removeItem('oria-qr-mode');
                  sessionStorage.removeItem('oria-table');
                  toast.success('Bezahlt!');
                  navigate(`/qr/success/${orderId}`);
                } catch (error) {
                  toast.error('Zahlungsfehler');
                }
              }}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
}
