import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const sections = [
    {
      title: "Zutaten",
      description: "Wir verwenden nur die frischesten und hochwertigsten Zutaten für all unsere Gerichte. Von zarten Fleischstücken bis hin zu frisch gebackenem Brot - Qualität steht bei uns an erster Stelle.",
      image: "https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=800&q=80",
      link: "/ingredients"
    },
    {
      title: "Unsere Geschichte",
      description: "Von bescheidenen Anfängen bis zu einem der beliebtesten mediterranen Restaurants der Region - erfahren Sie mehr über unseren Weg.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      link: "/story"
    },
    {
      title: "Vision & Werte",
      description: "Authentizität, Qualität und Gastfreundschaft sind die Grundpfeiler von Oria Grill. Erfahren Sie mehr über unsere Philosophie.",
      image: "https://images.unsplash.com/photo-1685798830572-f07ff7635774?w=800&q=80",
      link: "/vision"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Über Uns</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Erfahren Sie mehr über die Geschichte, die Werte und die Menschen hinter Oria Grill.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Link key={index} to={section.link} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1B4B73] mb-3 group-hover:text-[#E8A54B] transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
