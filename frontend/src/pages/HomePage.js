import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Clock, Leaf, Zap, MapPin, Award } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          axios.get(`${API}/bestsellers`),
          axios.get(`${API}/settings`)
        ]);
        setBestsellers(productsRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const benefits = [
    { icon: Leaf, title: 'Frisch zubereitet', desc: 'Alles frisch vor Ort' },
    { icon: Zap, title: 'Schnell', desc: 'In wenigen Minuten fertig' },
    { icon: Award, title: 'Halal-Optionen', desc: 'Zertifizierte Qualität' },
    { icon: MapPin, title: 'Abholung', desc: 'Bequem abholen' },
    { icon: Clock, title: 'Top Qualität', desc: 'Nur das Beste' },
  ];

  return (
    <div className="animate-slide-up">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
          alt="ORIA FRESH Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-16 md:pb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white uppercase">
            Fresh Food.<br />Real Taste.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-lg">
            Smash Burger • Bowls • Salads • Sides – schnell, frisch, modern
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/shop">
              <Button 
                className="h-14 px-8 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg shadow-green-500/30 text-lg"
                data-testid="hero-order-btn"
              >
                Jetzt bestellen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button 
                variant="outline"
                className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur border-white/20 text-lg"
                data-testid="hero-bestseller-btn"
              >
                Bestseller
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Bestseller</h2>
              <p className="text-slate-500 mt-1">Unsere beliebtesten Gerichte</p>
            </div>
            <Link 
              to="/shop" 
              className="hidden md:flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Alle ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestsellers.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop">
              <Button 
                variant="outline"
                className="rounded-full px-8"
                data-testid="bestseller-view-all-btn"
              >
                Alle Produkte ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center mb-12">
            Warum ORIA FRESH?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-green-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Teaser */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Besuch uns!
                </h2>
                <p className="text-slate-400 mt-4 text-lg">
                  Kirchenplatz 9, 18119 Rostock-Warnemünde
                </p>
                <div className="mt-6 space-y-2">
                  {settings?.opening_hours?.slice(0, 3).map((hour, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-400">{hour.day}</span>
                      <span className="text-white font-medium">
                        {hour.is_closed ? 'Geschlossen' : `${hour.open} - ${hour.close}`}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/location" className="mt-8">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8"
                    data-testid="location-teaser-btn"
                  >
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="h-64 md:h-auto">
                <img 
                  src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-green-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
            Hunger? Bestell jetzt!
          </h2>
          <p className="text-white/80 mt-4 text-lg">
            In weniger als 60 Sekunden zur Bestellung
          </p>
          <Link to="/shop" className="mt-8 inline-block">
            <Button 
              className="h-14 px-10 bg-white text-green-600 hover:bg-slate-100 font-bold rounded-full text-lg shadow-xl"
              data-testid="cta-order-btn"
            >
              Jetzt bestellen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
