import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, Utensils, MapPin, User, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout() {
  const location = useLocation();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <header className="hidden md:block sticky top-0 z-40 bg-[#0b1f3a]/95 backdrop-blur-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-400" />
            <span className="text-2xl font-black tracking-tight text-white">ORIA GRILL</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm lg:text-base">
            <a href="/#top" className="font-medium text-amber-50 hover:text-amber-300 transition-colors">Startseite</a>
            <Link to="/shop" className={`font-medium transition-colors ${location.pathname.startsWith('/shop') ? 'text-amber-300' : 'text-amber-50 hover:text-amber-300'}`}>Speisekarte</Link>
            <Link to="/shop/grill-tandoor" className={`font-medium transition-colors ${isActive('/shop/grill-tandoor') ? 'text-amber-300' : 'text-amber-50 hover:text-amber-300'}`}>Grill & Tandoor</Link>
            <Link to="/shop/mittagstisch" className={`font-medium transition-colors ${isActive('/shop/mittagstisch') ? 'text-amber-300' : 'text-amber-50 hover:text-amber-300'}`}>Mittagstisch</Link>
            <Link to="/about" className={`font-medium transition-colors ${isActive('/about') ? 'text-amber-300' : 'text-amber-50 hover:text-amber-300'}`}>Über uns</Link>
            <Link to="/contact" className={`font-medium transition-colors ${isActive('/contact') ? 'text-amber-300' : 'text-amber-50 hover:text-amber-300'}`}>Kontakt</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors">Jetzt reservieren</Link>
            <Link to="/shop" className="px-4 py-2 rounded-full border border-amber-400 text-amber-100 hover:bg-amber-500/20 font-semibold text-sm transition-colors">Abholung bestellen</Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              data-testid="cart-button-desktop"
            >
              <ShoppingBag className="w-6 h-6 text-amber-100" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <header className="md:hidden sticky top-0 z-40 bg-[#0b1f3a]/95 backdrop-blur-lg border-b border-amber-500/20">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-lg font-black tracking-tight text-white">ORIA GRILL</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            data-testid="cart-button-mobile"
          >
            <ShoppingBag className="w-6 h-6 text-amber-100" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      <footer className="hidden md:block bg-[#0b1f3a] text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-amber-400" />
                <span className="text-xl font-black tracking-tight">ORIA GRILL</span>
              </div>
              <p className="text-slate-300 text-sm">Orientalische Grillküche vom offenen Feuer.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2">
                <Link to="/shop" className="block text-slate-300 hover:text-white text-sm">Speisekarte</Link>
                <Link to="/shop/grill-tandoor" className="block text-slate-300 hover:text-white text-sm">Grill & Tandoor</Link>
                <Link to="/shop/mittagstisch" className="block text-slate-300 hover:text-white text-sm">Mittagstisch</Link>
                <Link to="/about" className="block text-slate-300 hover:text-white text-sm">Über uns</Link>
                <Link to="/contact" className="block text-slate-300 hover:text-white text-sm">Kontakt</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <div className="space-y-2">
                <Link to="/impressum" className="block text-slate-300 hover:text-white text-sm">Impressum</Link>
                <Link to="/datenschutz" className="block text-slate-300 hover:text-white text-sm">Datenschutz</Link>
                <Link to="/agb" className="block text-slate-300 hover:text-white text-sm">AGB</Link>
                <Link to="/widerruf" className="block text-slate-300 hover:text-white text-sm">Widerruf</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-slate-300 text-sm">
                <p>Kirchenplatz 9</p>
                <p>18119 Rostock-Warnemünde</p>
                <p>+49 381 7704 – 0</p>
                <p>info@oriagrill.de</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0b1f3a]/95 backdrop-blur-lg border-t border-amber-500/20 flex justify-around items-center z-50 pb-safe">
        <Link to="/" className={`flex flex-col items-center gap-0.5 ${isActive('/') ? 'text-amber-300' : 'text-amber-100/70'}`} data-testid="nav-home">
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Start</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-0.5 ${isActive('/shop') || location.pathname.startsWith('/shop/') ? 'text-amber-300' : 'text-amber-100/70'}`} data-testid="nav-shop">
          <Utensils className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Menü</span>
        </Link>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-0.5 text-amber-100/70 relative" data-testid="nav-cart">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Warenkorb</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <Link to="/location" className={`flex flex-col items-center gap-0.5 ${isActive('/location') ? 'text-amber-300' : 'text-amber-100/70'}`} data-testid="nav-location">
          <MapPin className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Kontakt</span>
        </Link>
        <Link to="/admin/login" className={`flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/admin') ? 'text-amber-300' : 'text-amber-100/70'}`} data-testid="nav-admin">
          <User className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Admin</span>
        </Link>
      </nav>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
