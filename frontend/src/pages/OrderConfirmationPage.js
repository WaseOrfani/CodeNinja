import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          axios.get(`${API}/orders/${orderId}/status`),
          axios.get(`${API}/settings`)
        ]);
        setOrder(orderRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-slide-up">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        Bestellung bestätigt!
      </h1>
      <p className="text-slate-500 text-lg mb-8">
        Vielen Dank für deine Bestellung bei ORIA FRESH
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <span className="text-slate-500">Bestellnummer</span>
          <span className="font-mono font-bold text-slate-900">#{orderId?.slice(0, 8).toUpperCase()}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <span className="text-slate-500">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order?.status === 'paid' ? 'bg-green-100 text-green-700' :
            order?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {order?.status === 'paid' ? 'Bezahlt' :
             order?.status === 'pending' ? 'Ausstehend' :
             order?.status || 'Wird bearbeitet'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Abholadresse</p>
              <p className="text-slate-500">Kirchenplatz 9, 18119 Rostock-Warnemünde</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Abholzeit</p>
              <p className="text-slate-500">Wird vorbereitet</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Fragen?</p>
              <p className="text-slate-500">+49 381 7704 – 0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-2xl p-6 mb-8">
        <p className="text-green-800">
          Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details deiner Bestellung.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8"
            data-testid="confirmation-shop-btn"
          >
            Weitere Bestellung
          </Button>
        </Link>
        <Link to="/">
          <Button 
            variant="outline"
            className="rounded-full px-8"
            data-testid="confirmation-home-btn"
          >
            Zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
}
