import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Leaf, Heart, Users, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Leaf, title: 'Frische Zutaten', desc: 'Wir verwenden nur die frischesten und hochwertigsten Zutaten für unsere Gerichte.' },
    { icon: Heart, title: 'Mit Liebe gemacht', desc: 'Jedes Gericht wird mit Leidenschaft und Sorgfalt zubereitet.' },
    { icon: Users, title: 'Familie & Community', desc: 'Wir sind mehr als ein Restaurant - wir sind eine Familie.' },
    { icon: Award, title: 'Qualität zuerst', desc: 'Keine Kompromisse bei Geschmack und Qualität.' },
  ];

  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"
          alt="ORIA FRESH Team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
            Über uns
          </h1>
          <p className="mt-2 text-lg text-white/80">Die Geschichte hinter ORIA FRESH</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
            Fresh Food. Real Taste.
          </h2>
          <div className="prose prose-lg text-slate-600">
            <p>
              ORIA FRESH wurde 2024 in Berlin gegründet mit einer einfachen Mission: 
              Leckeres, frisches und qualitativ hochwertiges Fast Food für jeden zugänglich zu machen.
            </p>
            <p>
              Unsere Smash Burger werden auf Bestellung zubereitet - jeder Patty wird frisch gesmasht 
              und mit den besten Zutaten kombiniert. Unsere Bowls und Salate sind perfekt für alle, 
              die gesund und lecker essen möchten.
            </p>
            <p>
              Bei uns steht Qualität an erster Stelle. Wir arbeiten nur mit ausgewählten Lieferanten 
              zusammen und bieten zertifizierte Halal-Optionen für unsere Gäste.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center mb-12">
            Unsere Werte
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{value.title}</h3>
                <p className="text-slate-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Überzeug dich selbst!
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Bestelle jetzt und erlebe den ORIA FRESH Unterschied
          </p>
          <Link to="/shop">
            <Button 
              className="h-14 px-10 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-lg shadow-lg shadow-green-500/20"
              data-testid="about-order-btn"
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
