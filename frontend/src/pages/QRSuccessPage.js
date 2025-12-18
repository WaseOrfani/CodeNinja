import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

export default function QRSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bestellung aufgegeben!
        </h1>
        <p className="text-slate-500 mb-6">
          Wir bereiten alles frisch für dich zu
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-500 mb-1">Bestellnummer</p>
          <p className="text-2xl font-mono font-bold text-green-600">
            #{orderId?.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="space-y-3 text-left mb-8">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-slate-600">Wird in wenigen Minuten fertig</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-slate-600">Abholung an der Theke</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-6">
          Wir rufen dich auf, wenn deine Bestellung fertig ist.
        </p>

        <Link to="/qr/shop" onClick={() => {
          sessionStorage.setItem('oria-qr-mode', 'true');
        }}>
          <Button 
            variant="outline" 
            className="w-full rounded-full"
            data-testid="qr-success-continue"
          >
            Weiter bestellen
          </Button>
        </Link>
      </div>
    </div>
  );
}
