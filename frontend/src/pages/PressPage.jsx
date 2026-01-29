import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Newspaper, Award, Tv, Quote } from 'lucide-react';

const PressPage = () => {
  const pressItems = [
    {
      source: "Berliner Zeitung",
      title: "Oria Grill: Das Geheimnis der perfekten Kebabs",
      excerpt: "Ein tiefgehender Blick in die Küche eines der beliebtesten mediterranen Restaurants der Hauptstadt.",
      date: "Juli 2025",
      type: "article"
    },
    {
      source: "Food & Travel Magazine",
      title: "Die 10 besten mediterranen Restaurants in Deutschland",
      excerpt: "Oria Grill landet auf Platz 3 unserer jährlichen Bestenliste.",
      date: "Juni 2025",
      type: "award"
    },
    {
      source: "RTL Punkt 12",
      title: "TV-Beitrag: Mediterrane Küche im Trend",
      excerpt: "Unser Küchenchef zeigt, wie authentische Kebabs zubereitet werden.",
      date: "Mai 2025",
      type: "tv"
    },
    {
      source: "Der Tagesspiegel",
      title: "Erfolgsgeschichte: Vom kleinen Imbiss zum Restaurant-Imperium",
      excerpt: "Die inspirierende Geschichte der Oria Grill Gründer.",
      date: "April 2025",
      type: "article"
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'article': return <Newspaper className="w-6 h-6" />;
      case 'award': return <Award className="w-6 h-6" />;
      case 'tv': return <Tv className="w-6 h-6" />;
      default: return <Newspaper className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Presse</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Was die Medien über Oria Grill sagen.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Press Items */}
          <div className="space-y-6">
            {pressItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1B4B73] rounded-full flex items-center justify-center flex-shrink-0 text-[#E8A54B]">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-[#E8A54B] font-medium">{item.source}</span>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1B4B73] mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Press Contact */}
          <div className="mt-16 bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#1B4B73] mb-4">Presseanfragen</h2>
            <p className="text-gray-600 mb-4">
              Für Presseanfragen, Interviews oder Bildmaterial wenden Sie sich bitte an unser PR-Team:
            </p>
            <p className="text-[#1B4B73] font-medium">presse@oriagrill.de</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PressPage;
