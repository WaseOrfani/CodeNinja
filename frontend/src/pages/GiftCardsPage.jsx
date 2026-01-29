import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Gift, CreditCard, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

const GiftCardsPage = () => {
  const giftCards = [
    { amount: 25, popular: false },
    { amount: 50, popular: true },
    { amount: 75, popular: false },
    { amount: 100, popular: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Geschenkkarten</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Verschenken Sie den Geschmack des Mittelmeers. Perfekt für jeden Anlass.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1B4B73] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-[#E8A54B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1B4B73] mb-2">Perfektes Geschenk</h3>
              <p className="text-gray-600 text-sm">Ideal für Geburtstage, Feiertage oder als Dankeschön.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1B4B73] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#E8A54B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1B4B73] mb-2">Einfach einzulösen</h3>
              <p className="text-gray-600 text-sm">Gültig in allen Oria Grill Standorten.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1B4B73] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#E8A54B]" />
              </div>
              <h3 className="text-lg font-bold text-[#1B4B73] mb-2">Digitaler Versand</h3>
              <p className="text-gray-600 text-sm">Sofort per E-Mail oder als physische Karte erhältlich.</p>
            </div>
          </div>

          {/* Gift Card Options */}
          <h2 className="text-2xl font-bold text-[#1B4B73] text-center mb-8">Wählen Sie einen Betrag</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {giftCards.map((card) => (
              <div
                key={card.amount}
                className={`relative bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow ${
                  card.popular ? 'ring-2 ring-[#E8A54B]' : ''
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8A54B] text-white text-xs px-3 py-1 rounded-full">
                    Beliebt
                  </span>
                )}
                <div className="text-4xl font-bold text-[#1B4B73] mb-2">€{card.amount}</div>
                <p className="text-gray-500 text-sm mb-4">Geschenkkarte</p>
                <Button className="w-full bg-[#1B4B73] hover:bg-[#163d5e] text-white">
                  Auswählen
                </Button>
              </div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Oder wählen Sie einen individuellen Betrag</p>
            <Button variant="outline" className="border-[#1B4B73] text-[#1B4B73] hover:bg-[#1B4B73] hover:text-white">
              Individueller Betrag
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftCardsPage;
