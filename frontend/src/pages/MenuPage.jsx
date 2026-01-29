import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { menuItems } from '../data/mock';
import { Leaf, Flame, Check } from 'lucide-react';

const MenuPage = () => {
  const renderTag = (tag) => {
    const tagStyles = {
      vegetarisch: { bg: 'bg-green-100', text: 'text-green-700', icon: <Leaf className="w-3 h-3" /> },
      vegan: { bg: 'bg-green-100', text: 'text-green-700', icon: <Leaf className="w-3 h-3" /> },
      halal: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Check className="w-3 h-3" /> },
      glutenfrei: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: null },
      premium: { bg: 'bg-purple-100', text: 'text-purple-700', icon: null },
      bestseller: { bg: 'bg-red-100', text: 'text-red-700', icon: <Flame className="w-3 h-3" /> },
      beliebt: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <Flame className="w-3 h-3" /> },
      fisch: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: null },
    };
    const style = tagStyles[tag] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
    return (
      <span key={tag} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${style.bg} ${style.text}`}>
        {style.icon}
        {tag}
      </span>
    );
  };

  const MenuSection = ({ id, title, items, showImage = true }) => (
    <section id={id} className="py-12 scroll-mt-40">
      <h2 className="text-3xl font-bold text-[#1B4B73] mb-8 text-center">{title}</h2>
      <div className={`grid gap-6 ${showImage ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {showImage && item.image && (
              <div className="h-48 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-[#1B4B73]">{item.name}</h3>
                <span className="text-lg font-bold text-[#E8A54B]">{item.price}</span>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              )}
              <div className="flex flex-wrap gap-2 items-center">
                {item.calories && (
                  <span className="text-xs text-gray-500">{item.calories}</span>
                )}
                {item.serves && (
                  <span className="text-xs text-gray-500">{item.serves}</span>
                )}
                {item.tags && item.tags.map(tag => renderTag(tag))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const SimpleBeilagenSection = ({ id, title, items }) => (
    <section id={id} className="py-12 scroll-mt-40">
      <h2 className="text-3xl font-bold text-[#1B4B73] mb-8 text-center">{title}</h2>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {items.map((item, index) => (
          <div key={item.id} className={`flex justify-between items-center py-3 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div>
              <span className="font-medium text-[#1B4B73]">{item.name}</span>
              {item.calories && <span className="text-xs text-gray-500 ml-2">({item.calories})</span>}
            </div>
            <span className="font-bold text-[#E8A54B]">{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Speisekarte</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Entdecken Sie unsere authentischen mediterranen Gerichte, zubereitet mit den frischesten Zutaten.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="#" className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-sm">
                Druckbare Speisekarte (PDF)
              </Link>
              <Link to="/catering" className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-sm">
                Catering Menü
              </Link>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-white/80">
              <span className="flex items-center gap-1"><Leaf className="w-4 h-4 text-green-400" /> Vegetarisch</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-blue-400" /> Halal</span>
              <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-red-400" /> Beliebt</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="sticky top-32 bg-white shadow-sm z-40 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {['vorspeisen', 'salate', 'sandwiches', 'mittagsangebote', 'hauptgerichte', 'vegetarisch', 'beilagen', 'desserts', 'getranke', 'familienplatten'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="px-3 py-1.5 text-sm text-[#1B4B73] hover:text-[#E8A54B] hover:bg-gray-50 rounded transition-colors capitalize"
                >
                  {section.replace('ae', 'ä').replace('ue', 'ü')}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="max-w-7xl mx-auto px-4">
          <MenuSection id="vorspeisen" title="Vorspeisen" items={menuItems.vorspeisen} />
          <MenuSection id="salate" title="Salate" items={menuItems.salate} />
          <MenuSection id="sandwiches" title="Sandwiches" items={menuItems.sandwiches} />
          <MenuSection id="mittagsangebote" title="Mittagsangebote" items={menuItems.mittagsangebote} />
          <MenuSection id="hauptgerichte" title="Hauptgerichte" items={menuItems.hauptgerichte} />
          <MenuSection id="vegetarisch" title="Vegetarisch" items={menuItems.vegetarisch} />
          <SimpleBeilagenSection id="beilagen" title="Beilagen" items={menuItems.beilagen} />
          <MenuSection id="desserts" title="Desserts" items={menuItems.desserts} />
          <SimpleBeilagenSection id="getranke" title="Getränke" items={menuItems.getranke} />
          <MenuSection id="familienplatten" title="Familien Platten" items={menuItems.familienplatten} showImage={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
