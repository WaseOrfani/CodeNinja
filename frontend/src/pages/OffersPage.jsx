import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tag, Clock, Users } from 'lucide-react';

const OffersPage = () => {
  const offers = [
    {
      title: "Mittagsmenü",
      description: "Jeden Tag von 11:00 bis 15:00 Uhr - Genießen Sie unser täglich wechselndes Mittagsangebot mit Hauptgericht, Beilage und Getränk.",
      price: "Ab €12.90",
      badge: "Mo-Fr",
      image: "https://images.unsplash.com/photo-1676471984382-a6dd86b507e9?w=600&q=80"
    },
    {
      title: "Family Friday",
      description: "Jeden Freitag: Bestellen Sie eine Familienplatte und erhalten Sie 10% Rabatt auf Ihre gesamte Bestellung.",
      price: "10% Rabatt",
      badge: "Freitags",
      image: "https://images.pexels.com/photos/6459331/pexels-photo-6459331.jpeg?w=600"
    },
    {
      title: "Happy Hour",
      description: "Täglich von 16:00 bis 18:00 Uhr - Alle Vorspeisen zum halben Preis!",
      price: "50% auf Vorspeisen",
      badge: "Täglich",
      image: "https://images.unsplash.com/photo-1695465832919-7383a6a25ee5?w=600&q=80"
    },
    {
      title: "Studentenrabatt",
      description: "Zeigen Sie Ihren Studentenausweis und erhalten Sie 15% Rabatt auf alle Hauptgerichte.",
      price: "15% Rabatt",
      badge: "Mit Ausweis",
      image: "https://images.unsplash.com/photo-1744175331258-f4758acce6ca?w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Aktuelle Angebote</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Entdecken Sie unsere aktuellen Sonderangebote und sparen Sie bei Ihrem nächsten Besuch.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {offers.map((offer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-[#E8A54B] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {offer.badge}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-[#1B4B73]">{offer.title}</h3>
                    <span className="text-lg font-bold text-[#E8A54B]">{offer.price}</span>
                  </div>
                  <p className="text-gray-600">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-[#1B4B73] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Verpassen Sie keine Angebote!</h2>
            <p className="text-gray-300 mb-6">
              Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive Angebote direkt in Ihr Postfach.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-2 rounded border-0 focus:ring-2 focus:ring-[#E8A54B]"
              />
              <button className="px-6 py-2 bg-[#E8A54B] text-white rounded font-medium hover:bg-[#d4943f] transition-colors">
                Anmelden
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OffersPage;
