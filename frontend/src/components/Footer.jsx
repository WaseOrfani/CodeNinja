import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a1a] text-gray-400">
      {/* Scroll to top button */}
      <div className="flex justify-center">
        <button
          onClick={scrollToTop}
          className="-mt-6 w-12 h-12 bg-[#E8A54B] text-white rounded-full flex items-center justify-center hover:bg-[#d4943f] transition-colors shadow-lg"
          aria-label="Nach oben scrollen"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-light tracking-tight">
                  <span className="text-[#E8A54B]">o</span>
                  <span className="text-white">ria</span>
                </span>
                <span className="text-3xl font-light text-white ml-1">grill</span>
              </div>
            </Link>
            <p className="text-sm mb-4">
              Authentische mediterrane Küche seit 2010
            </p>
            {/* Anniversary badge */}
            <div className="inline-block bg-[#E8A54B] text-[#1B4B73] px-4 py-2 rounded font-bold text-sm">
              15 Jahre Leidenschaft
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Über uns</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/story" className="hover:text-[#E8A54B] transition-colors">Unsere Geschichte</Link></li>
              <li><Link to="/ingredients" className="hover:text-[#E8A54B] transition-colors">Zutaten</Link></li>
              <li><Link to="/vision" className="hover:text-[#E8A54B] transition-colors">Vision & Werte</Link></li>
              <li><Link to="/careers" className="hover:text-[#E8A54B] transition-colors">Karriere</Link></li>
            </ul>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Speisekarte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/menu#vorspeisen" className="hover:text-[#E8A54B] transition-colors">Vorspeisen</Link></li>
              <li><Link to="/menu#hauptgerichte" className="hover:text-[#E8A54B] transition-colors">Hauptgerichte</Link></li>
              <li><Link to="/menu#desserts" className="hover:text-[#E8A54B] transition-colors">Desserts</Link></li>
              <li><Link to="/catering" className="hover:text-[#E8A54B] transition-colors">Catering</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#E8A54B]" />
                <span>+49 30 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-[#E8A54B]" />
                <span>info@oriagrill.de</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-[#E8A54B]" />
                <span>Friedrichstraße 123<br />10117 Berlin</span>
              </li>
            </ul>
            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-[#E8A54B] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E8A54B] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E8A54B] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs">
          <p>
            Copyright {new Date().getFullYear()} Oria Grill. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
