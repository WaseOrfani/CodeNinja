import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, admin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (admin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Erfolgreich eingeloggt!');
      navigate('/admin');
    } catch (error) {
      toast.error('Login fehlgeschlagen. Bitte überprüfe deine Daten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-3xl font-black tracking-tighter text-slate-900">ORIA</span>
            <span className="text-3xl font-black tracking-tighter text-green-500">FRESH</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-2">Melde dich an, um das Dashboard zu nutzen</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-700">E-Mail</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oriafresh.de"
                  className="pl-10 h-12"
                  required
                  data-testid="admin-login-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Passwort</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  required
                  data-testid="admin-login-password"
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
              data-testid="admin-login-submit"
            >
              {loading ? 'Wird eingeloggt...' : 'Einloggen'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              Demo-Zugang:<br />
              <span className="font-mono">admin@oriafresh.de</span> / <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
