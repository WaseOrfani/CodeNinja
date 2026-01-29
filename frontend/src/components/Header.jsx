import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingBag, Utensils, ShoppingCart, Smartphone } from 'lucide-react';
import { navLinks, actionButtons } from '../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'ShoppingCart': return <ShoppingCart className="w-5 h-5" />;
      default: return null;
    }
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      {/* Top accent bar */}
      <div className="h-1 bg-[#1B4B73]" />
      
      {/* Main header content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-baseline">
              <span className="text-4xl font-light tracking-tight">
                <span className="text-[#E8A54B]">o</span>
                <span className="text-[#1B4B73]">ria</span>
              </span>
              <span className="text-4xl font-light text-[#1B4B73] ml-1">grill</span>
            </div>
            <div className="ml-2 text-xs text-[#E8A54B] uppercase tracking-wider font-medium hidden sm:block">
              <span>Mediterranean</span>
              <br />
              <span>Kitchen</span>
            </div>
          </Link>

          {/* Right side - App download and action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 mr-4">
              <span className="mr-2">Hol dir die App</span>
              <Smartphone className="w-5 h-5 text-[#1B4B73]" />
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-1">
              {actionButtons.map((btn) => (
                <Link
                  key={btn.name}
                  to={btn.link}
                  className="flex flex-col items-center justify-center px-4 py-2 bg-[#1B4B73] text-white rounded-sm hover:bg-[#163d5e] transition-colors min-w-[80px]"
                >
                  <span className="text-[#E8A54B]">{getIcon(btn.icon)}</span>
                  <span className="text-xs mt-1">{btn.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-[#1B4B73]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center py-2 border-t border-gray-100" ref={dropdownRef}>
          <ul className="flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <li key={link.name} className="relative group">
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`flex items-center text-sm font-medium tracking-wide transition-colors hover:text-[#E8A54B] ${
                        location.pathname === link.path || location.pathname.startsWith(link.path + '/') ? 'text-[#E8A54B]' : 'text-[#1B4B73]'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Dropdown menu */}
                    {activeDropdown === index && link.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-[#1B4B73] hover:bg-gray-50 hover:text-[#E8A54B] transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center text-sm font-medium tracking-wide transition-colors hover:text-[#E8A54B] ${
                      location.pathname === link.path ? 'text-[#E8A54B]' : 'text-[#1B4B73]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
                {/* Hover underline effect */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#E8A54B] transform origin-left transition-transform duration-300 ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`block text-sm font-medium ${
                      location.pathname === link.path ? 'text-[#E8A54B]' : 'text-[#1B4B73]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {/* Mobile dropdown items */}
                  {link.hasDropdown && link.dropdownItems && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {link.dropdownItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="block text-sm text-gray-600 hover:text-[#E8A54B]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex space-x-2">
              {actionButtons.map((btn) => (
                <Link
                  key={btn.name}
                  to={btn.link}
                  className="flex-1 flex flex-col items-center justify-center py-3 bg-[#1B4B73] text-white rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-[#E8A54B]">{getIcon(btn.icon)}</span>
                  <span className="text-xs mt-1">{btn.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
