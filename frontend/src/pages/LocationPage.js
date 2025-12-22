import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function LocationPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await api.getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const defaultHours = [
    { day: 'Montag', open: '11:00', close: '22:00', is_closed: false },
    { day: 'Dienstag', open: '11:00', close: '22:00', is_closed: false },
    { day: 'Mittwoch', open: '11:00', close: '22:00', is_closed: false },
    { day: 'Donnerstag', open: '11:00', close: '22:00', is_closed: false },
    { day: 'Freitag', open: '11:00', close: '23:00', is_closed: false },
    { day: 'Samstag', open: '12:00', close: '23:00', is_closed: false },
    { day: 'Sonntag', open: '12:00', close: '21:00', is_closed: false },
  ];

  const hours = settings?.opening_hours || defaultHours;
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long' });

  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <section className="relative h-[40vh] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg"
          alt="ORIA FRESH Location"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
            Standort
          </h1>
          <p className="mt-2 text-lg text-white/80">Besuche uns oder hol deine Bestellung ab</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 text-lg mb-2">Standort ORIA FRESH</h2>
                  <p className="text-slate-600">Kirchenplatz 9</p>
                  <p className="text-slate-600">18119 Rostock-Warnemünde</p>
                  <p className="text-slate-600">Deutschland</p>
                  <a 
                    href="https://maps.google.com/?q=Kirchenplatz+9,+18119+Rostock-Warnemünde" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center gap-1 mt-3"
                  >
                    In Google Maps öffnen
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 text-lg mb-4">Kontakt</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <a href="tel:+4938177040" className="text-slate-600 hover:text-green-600">
                    +49 381 7704 – 0
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <a href="mailto:info@oriafresh.de" className="text-slate-600 hover:text-green-600">
                    info@oriafresh.de
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-slate-900 text-lg">Öffnungszeiten</h2>
              </div>
              <div className="space-y-3">
                {hours.map((hour, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between py-2 ${
                      hour.day === today ? 'bg-green-50 -mx-2 px-2 rounded-lg' : ''
                    }`}
                  >
                    <span className={`${hour.day === today ? 'font-semibold text-green-700' : 'text-slate-600'}`}>
                      {hour.day}
                      {hour.day === today && <span className="text-xs ml-2">(Heute)</span>}
                    </span>
                    <span className={`${hour.day === today ? 'font-semibold text-green-700' : 'text-slate-900'}`}>
                      {hour.is_closed ? 'Geschlossen' : `${hour.open} - ${hour.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden h-[500px] lg:h-auto relative">
            <img 
              src="https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg"
              alt="Map"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">ORIA FRESH</p>
                <p className="text-slate-500 text-sm">Rostock-Warnemünde</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Hungrig?</h2>
          <p className="text-slate-500 mb-6">Bestelle jetzt und hol dein Essen bei uns ab!</p>
          <Link to="/shop">
            <Button 
              className="h-12 px-8 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg shadow-green-500/20"
              data-testid="location-order-btn"
            >
              Jetzt bestellen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
