import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, Utensils, MapPin, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout() {
  const location = useLocation();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Navigation */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-slate-900">ORIA</span>
            <span className="text-2xl font-black tracking-tighter text-green-500">FRESH</span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link 
              to="/shop" 
              className={`font-medium transition-colors ${isActive('/shop') ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${isActive('/about') ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Über uns
            </Link>
            <Link 
              to="/location" 
              className={`font-medium transition-colors ${isActive('/location') ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Standort
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${isActive('/contact') ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Kontakt
            </Link>
          </nav>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            data-testid="cart-button-desktop"
          >
            <ShoppingBag className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tighter text-slate-900">ORIA</span>
            <span className="text-xl font-black tracking-tighter text-green-500">FRESH</span>
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            data-testid="cart-button-mobile"
          >
            <ShoppingBag className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Footer - Desktop */}
      <footer className="hidden md:block bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-1 mb-4">
                <span className="text-xl font-black tracking-tighter">ORIA</span>
                <span className="text-xl font-black tracking-tighter text-green-400">FRESH</span>
              </div>
              <p className="text-slate-400 text-sm">Fresh Food. Real Taste.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2">
                <Link to="/shop" className="block text-slate-400 hover:text-white text-sm">Shop</Link>
                <Link to="/about" className="block text-slate-400 hover:text-white text-sm">Über uns</Link>
                <Link to="/location" className="block text-slate-400 hover:text-white text-sm">Standort</Link>
                <Link to="/contact" className="block text-slate-400 hover:text-white text-sm">Kontakt</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <div className="space-y-2">
                <Link to="/impressum" className="block text-slate-400 hover:text-white text-sm">Impressum</Link>
                <Link to="/datenschutz" className="block text-slate-400 hover:text-white text-sm">Datenschutz</Link>
                <Link to="/agb" className="block text-slate-400 hover:text-white text-sm">AGB</Link>
                <Link to="/widerruf" className="block text-slate-400 hover:text-white text-sm">Widerruf</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>Musterstraße 123</p>
                <p>12345 Berlin</p>
                <p>+49 30 12345678</p>
                <p>info@oriafresh.de</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} ORIA FRESH. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center z-50 pb-safe">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-0.5 ${isActive('/') ? 'text-green-600' : 'text-slate-400'}`}
          data-testid="nav-home"
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link 
          to="/shop" 
          className={`flex flex-col items-center gap-0.5 ${isActive('/shop') || location.pathname.startsWith('/shop/') ? 'text-green-600' : 'text-slate-400'}`}
          data-testid="nav-shop"
        >
          <Utensils className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Menü</span>
        </Link>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-400 relative"
          data-testid="nav-cart"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Warenkorb</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <Link 
          to="/location" 
          className={`flex flex-col items-center gap-0.5 ${isActive('/location') ? 'text-green-600' : 'text-slate-400'}`}
          data-testid="nav-location"
        >
          <MapPin className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Standort</span>
        </Link>
        <Link 
          to="/admin/login" 
          className={`flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/admin') ? 'text-green-600' : 'text-slate-400'}`}
          data-testid="nav-admin"
        >
          <User className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-medium">Admin</span>
        </Link>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
