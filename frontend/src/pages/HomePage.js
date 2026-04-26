import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Flame, Beef, Wheat } from 'lucide-react';
import api from '../lib/api';

const menuCategories = [
  'Holzkohlegrill',
  'Tandoor Spezialitäten',
  'Döner & Dürüm',
  'Pizza aus dem Ofen',
  'Afghanische Küche',
  'Persische Küche',
  'Arabische Spezialitäten',
  'Salate & Vorspeisen',
  'Familienplatten',
  'Getränke'
];

const specialties = [
  {
    icon: Flame,
    title: 'Holzkohlegrill',
    text: 'Saftige Fleischspieße direkt vom Grill – frisch zubereitet und aromatisch gewürzt.',
    image: 'https://images.pexels.com/photos/8629036/pexels-photo-8629036.jpeg'
  },
  {
    icon: Wheat,
    title: 'Tandoor Ofen',
    text: 'Knuspriges Brot, zarte Fleischgerichte und orientalische Klassiker aus dem Tandoor.',
    image: 'https://images.pexels.com/photos/6164040/pexels-photo-6164040.jpeg'
  },
  {
    icon: Beef,
    title: 'Familienplatten',
    text: 'Große Grillplatten zum Teilen – ideal für Familien, Gruppen und besondere Anlässe.',
    image: 'https://images.pexels.com/photos/5639449/pexels-photo-5639449.jpeg'
  }
];

export default function HomePage() {
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

  return (
    <div className="animate-slide-up" id="top">
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg"
          alt="Grill und orientalische Spezialitäten"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a]/90 via-[#0b1f3a]/70 to-[#8b3f1f]/50" />

        <div className="relative max-w-7xl mx-auto px-4 pt-24 md:pt-36 pb-16 md:pb-24">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-[#fffaf2] max-w-4xl">
            Orientalische Grillküche vom offenen Feuer
          </h1>
          <p className="mt-5 text-base md:text-xl text-amber-50/90 max-w-3xl leading-relaxed">
            Frisch gegrillte Spieße, Tandoor-Spezialitäten, Döner, Pizza und traditionelle Gerichte aus Afghanistan, Persien und dem arabischen Raum – zubereitet mit Feuer, Gewürzen und echter Gastfreundschaft.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/shop">
              <Button className="h-12 md:h-14 px-6 md:px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full text-base md:text-lg">
                Speisekarte ansehen
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 bg-white/10 hover:bg-white/20 text-amber-50 border-amber-200/40 rounded-full text-base md:text-lg">
                Tisch reservieren
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 bg-transparent hover:bg-amber-500/20 text-amber-50 border-amber-300/60 rounded-full text-base md:text-lg">
                Abholung bestellen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="speisekarte" className="py-14 md:py-20 px-4 bg-[#fffaf2]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#0b1f3a]">Speisekarte</h2>
            <p className="text-slate-700 mt-3 text-lg">Unsere Kategorien für Grill, Tandoor und orientalische Küche.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {menuCategories.map((category) => (
              <div key={category} className="rounded-2xl border border-amber-200 bg-white px-4 py-4 text-[#0b1f3a] font-semibold text-sm md:text-base shadow-sm">
                {category}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/shop">
              <Button className="bg-[#0b1f3a] hover:bg-[#12315a] text-amber-100 rounded-full px-8 h-12">
                Speisekarte ansehen <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-gradient-to-b from-[#fff3df] to-[#fffaf2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#0b1f3a] mb-10">Unsere Spezialitäten</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {specialties.map((item) => (
              <article key={item.title} className="rounded-3xl overflow-hidden bg-white border border-amber-200 shadow-sm">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className="p-6">
                  <item.icon className="w-7 h-7 text-amber-600 mb-3" />
                  <h3 className="text-2xl font-bold text-[#0b1f3a]">{item.title}</h3>
                  <p className="text-slate-700 mt-3 leading-relaxed">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0b1f3a] rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-amber-100">Besuch uns in Warnemünde</h2>
                <p className="text-amber-50/80 mt-4 text-lg">Kirchenplatz 9, 18119 Rostock-Warnemünde</p>
                <div className="mt-6 space-y-2">
                  {settings?.opening_hours?.slice(0, 3).map((hour, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-amber-50/70">{hour.day}</span>
                      <span className="text-white font-medium">{hour.is_closed ? 'Geschlossen' : `${hour.open} - ${hour.close}`}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/contact">
                    <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full px-7">Tisch reservieren</Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="outline" className="border-amber-300 text-amber-100 hover:bg-amber-500/20 rounded-full px-7">Abholung bestellen</Button>
                  </Link>
                </div>
              </div>
              <div className="h-64 md:h-auto">
                <img
                  src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg"
                  alt="Restaurant Ambiente"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-[#8b3f1f] to-[#c66a2b]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#fffaf2]">Jetzt Hunger auf Grill?</h2>
          <p className="text-amber-100 mt-4 text-lg">Bestelle online oder reserviere deinen Tisch in wenigen Klicks.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className="inline-block">
              <Button className="h-12 px-8 bg-[#fffaf2] text-[#8b3f1f] hover:bg-white font-bold rounded-full">Speisekarte ansehen</Button>
            </Link>
            <Link to="/contact" className="inline-block">
              <Button variant="outline" className="h-12 px-8 border-amber-100 text-[#fffaf2] hover:bg-white/10 font-bold rounded-full">Tisch reservieren</Button>
            </Link>
            <Link to="/shop" className="inline-block">
              <Button variant="outline" className="h-12 px-8 border-amber-100 text-[#fffaf2] hover:bg-white/10 font-bold rounded-full">Abholung bestellen</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
