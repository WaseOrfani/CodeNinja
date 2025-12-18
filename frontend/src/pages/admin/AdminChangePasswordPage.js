import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminChangePasswordPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const passwordRequirements = [
    { test: (p) => p.length >= 12, label: 'Mindestens 12 Zeichen' },
    { test: (p) => /[A-Z]/.test(p), label: 'Ein Großbuchstabe' },
    { test: (p) => /[a-z]/.test(p), label: 'Ein Kleinbuchstabe' },
    { test: (p) => /[0-9]/.test(p), label: 'Eine Zahl' },
    { test: (p) => /[!@#$%^&*]/.test(p), label: 'Ein Sonderzeichen (!@#$%^&*)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }

    const failedRequirements = passwordRequirements.filter(r => !r.test(formData.new_password));
    if (failedRequirements.length > 0) {
      toast.error(`Passwort erfüllt nicht alle Anforderungen`);
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      await axios.post(`${API}/admin/change-password`, {
        current_password: formData.current_password,
        new_password: formData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Passwort erfolgreich geändert!');
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            Passwort ändern
          </CardTitle>
          <CardDescription>
            Wähle ein sicheres Passwort mit mindestens 12 Zeichen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="current">Aktuelles Passwort</Label>
              <div className="relative mt-1">
                <Input 
                  id="current"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                  required
                  className="pr-10"
                  data-testid="current-password-input"
                />
                <button 
                  type="button"
                  onClick={() => togglePassword('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="new">Neues Passwort</Label>
              <div className="relative mt-1">
                <Input 
                  id="new"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                  required
                  className="pr-10"
                  data-testid="new-password-input"
                />
                <button 
                  type="button"
                  onClick={() => togglePassword('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password requirements */}
              <div className="mt-3 space-y-1">
                {passwordRequirements.map((req, i) => {
                  const passed = req.test(formData.new_password);
                  return (
                    <div key={i} className={`flex items-center gap-2 text-sm ${passed ? 'text-green-600' : 'text-slate-400'}`}>
                      {passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {req.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="confirm">Passwort bestätigen</Label>
              <div className="relative mt-1">
                <Input 
                  id="confirm"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  required
                  className="pr-10"
                  data-testid="confirm-password-input"
                />
                <button 
                  type="button"
                  onClick={() => togglePassword('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                <p className="text-sm text-red-500 mt-1">Passwörter stimmen nicht überein</p>
              )}
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
              data-testid="change-password-btn"
            >
              {loading ? 'Wird geändert...' : 'Passwort ändern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
