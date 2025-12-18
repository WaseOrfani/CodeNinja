import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CreditCard, Banknote, Clock, MapPin, ArrowLeft } from 'lucide-react';
import CheckoutUpsell from '../components/CheckoutUpsell';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    pickup_time: 'sofort',
    notes: '',
    payment_method: 'pickup'
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
      return;
    }
    
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API}/settings`);
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      toast.error('Bitte gib deinen Namen ein');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      toast.error('Bitte gib deine Telefonnummer ein');
      return false;
    }
    if (!formData.customer_email.trim() || !formData.customer_email.includes('@')) {
      toast.error('Bitte gib eine gültige E-Mail ein');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return null;
    
    try {
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
        customer_email: formData.customer_email,
        pickup_time: formData.pickup_time,
        notes: formData.notes,
        payment_method: formData.payment_method,
        subtotal: cartTotal,
        total: cartTotal
      };

      const response = await axios.post(`${API}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Fehler beim Erstellen der Bestellung');
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
        toast.success('Bestellung erfolgreich aufgegeben!');
        navigate(`/order-confirmation/${order.order_id}`);
      }
    } catch (error) {
      toast.error('Fehler bei der Bestellung');
    } finally {
      setLoading(false);
    }
  };

  const pickupSlots = settings?.pickup_slots || ['sofort', '15 min', '30 min', '45 min', '60 min'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 animate-slide-up">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        data-testid="checkout-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück zum Warenkorb</span>
      </button>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Kasse
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upsell Section - only shows if cart < €25 */}
          <CheckoutUpsell items={items} cartTotal={cartTotal} />
          
          {/* Pickup Info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Abholung</h2>
                <p className="text-sm text-slate-500">Kirchenplatz 9, 18119 Rostock-Warnemünde</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pickup_time" className="text-slate-700">Abholzeit</Label>
                <Select 
                  value={formData.pickup_time} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, pickup_time: value }))}
                >
                  <SelectTrigger className="h-12 mt-1" data-testid="pickup-time-select">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer Data */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Deine Daten</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name" className="text-slate-700">Name *</Label>
                <Input 
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Dein Name"
                  className="h-12 mt-1"
                  data-testid="checkout-name-input"
                />
              </div>
              
              <div>
                <Label htmlFor="customer_phone" className="text-slate-700">Telefon *</Label>
                <Input 
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+49 123 456789"
                  className="h-12 mt-1"
                  data-testid="checkout-phone-input"
                />
              </div>
              
              <div>
                <Label htmlFor="customer_email" className="text-slate-700">E-Mail *</Label>
                <Input 
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="max@example.com"
                  className="h-12 mt-1"
                  data-testid="checkout-email-input"
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-slate-700">Anmerkungen (optional)</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="z.B. ohne Zwiebeln, extra Sauce..."
                  className="mt-1"
                  rows={3}
                  data-testid="checkout-notes-input"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Zahlungsmethode</h2>
            
            <RadioGroup 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
              className="space-y-3"
            >
              <label 
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'pickup' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <RadioGroupItem value="pickup" id="pickup" data-testid="payment-pickup" />
                <Banknote className="w-6 h-6 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">Zahlung bei Abholung</p>
                  <p className="text-sm text-slate-500">Bar oder Kartenzahlung vor Ort</p>
                </div>
              </label>
              
              <label 
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'paypal' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <RadioGroupItem value="paypal" id="paypal" data-testid="payment-paypal" />
                <CreditCard className="w-6 h-6 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">PayPal</p>
                  <p className="text-sm text-slate-500">Sicher online bezahlen</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-slate-900 mb-4">Deine Bestellung</h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 truncate">{item.quantity}x {item.product_name}</p>
                    <p className="text-slate-500 text-xs">{item.variant}</p>
                  </div>
                  <span className="text-slate-900 ml-2">€{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 my-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Zwischensumme</span>
                <span className="text-slate-900">€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Abholung</span>
                <span className="text-green-600">Kostenlos</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-slate-900">Gesamt</span>
                <span className="text-2xl font-bold text-slate-900">€{cartTotal.toFixed(2)}</span>
              </div>

              {formData.payment_method === 'pickup' ? (
                <Button 
                  onClick={handlePickupPayment}
                  disabled={loading}
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20"
                  data-testid="checkout-submit-btn"
                >
                  {loading ? 'Wird bearbeitet...' : 'Bestellung abschicken'}
                </Button>
              ) : (
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'pill' }}
                    disabled={!formData.customer_name || !formData.customer_phone || !formData.customer_email}
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
                        toast.success('Zahlung erfolgreich!');
                        navigate(`/order-confirmation/${orderId}`);
                      } catch (error) {
                        toast.error('Fehler bei der Zahlung');
                      }
                    }}
                    onError={() => {
                      toast.error('PayPal-Fehler. Bitte versuche es erneut.');
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
