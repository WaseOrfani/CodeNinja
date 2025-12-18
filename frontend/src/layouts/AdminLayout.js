import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { admin, loading, logout } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Produkte' },
    { path: '/admin/orders', icon: ClipboardList, label: 'Bestellungen' },
    { path: '/admin/settings', icon: Settings, label: 'Einstellungen' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tighter text-slate-900">ORIA</span>
            <span className="text-xl font-black tracking-tighter text-green-500">FRESH</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              data-testid={`admin-nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Home className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-medium">Zur Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            data-testid="admin-logout"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-medium">Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-lg font-black tracking-tighter text-slate-900">ORIA</span>
          <span className="text-lg font-black tracking-tighter text-green-500">FRESH</span>
        </Link>
        <button onClick={logout} className="p-2 text-red-600" data-testid="admin-logout-mobile">
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              isActive(item.path) ? 'text-green-600' : 'text-slate-400'
            }`}
            data-testid={`admin-nav-mobile-${item.label.toLowerCase()}`}
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
