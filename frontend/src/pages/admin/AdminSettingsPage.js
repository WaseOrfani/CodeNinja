import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Clock, MapPin, Phone, Mail, Save } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminSettingsPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    restaurant_name: 'ORIA FRESH',
    address: 'Musterstraße 123, 12345 Berlin',
    phone: '+49 30 12345678',
    email: 'info@oriafresh.de',
    pickup_slots: ['sofort', '15 min', '30 min', '45 min', '60 min'],
    opening_hours: [
      { day: 'Montag', open: '11:00', close: '22:00', is_closed: false },
      { day: 'Dienstag', open: '11:00', close: '22:00', is_closed: false },
      { day: 'Mittwoch', open: '11:00', close: '22:00', is_closed: false },
      { day: 'Donnerstag', open: '11:00', close: '22:00', is_closed: false },
      { day: 'Freitag', open: '11:00', close: '23:00', is_closed: false },
      { day: 'Samstag', open: '12:00', close: '23:00', is_closed: false },
      { day: 'Sonntag', open: '12:00', close: '21:00', is_closed: false },
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      if (response.data && Object.keys(response.data).length > 0) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      await axios.put(`${API}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Einstellungen gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const updateOpeningHour = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      opening_hours: prev.opening_hours.map((h, i) => 
        i === index ? { ...h, [field]: value } : h
      )
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Einstellungen</h1>
          <p className="text-slate-500 mt-1">Restaurant-Konfiguration</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full"
          data-testid="save-settings-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Speichern...' : 'Speichern'}
        </Button>
      </div>

      {/* Contact Info */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-green-600" />
            Kontaktinformationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Restaurant-Name</Label>
              <Input 
                value={settings.restaurant_name}
                onChange={(e) => setSettings({...settings, restaurant_name: e.target.value})}
                className="mt-1"
                data-testid="settings-name-input"
              />
            </div>
            <div>
              <Label>E-Mail</Label>
              <Input 
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="mt-1"
                data-testid="settings-email-input"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Telefon</Label>
              <Input 
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="mt-1"
                data-testid="settings-phone-input"
              />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input 
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="mt-1"
                data-testid="settings-address-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-green-600" />
            Öffnungszeiten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settings.opening_hours.map((hour, index) => (
              <div key={index} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                <span className="w-28 font-medium text-slate-900">{hour.day}</span>
                <div className="flex items-center gap-2 flex-1">
                  <Input 
                    type="time"
                    value={hour.open}
                    onChange={(e) => updateOpeningHour(index, 'open', e.target.value)}
                    disabled={hour.is_closed}
                    className="w-28"
                  />
                  <span className="text-slate-400">bis</span>
                  <Input 
                    type="time"
                    value={hour.close}
                    onChange={(e) => updateOpeningHour(index, 'close', e.target.value)}
                    disabled={hour.is_closed}
                    className="w-28"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={hour.is_closed}
                    onCheckedChange={(checked) => updateOpeningHour(index, 'is_closed', checked)}
                  />
                  <span className="text-sm text-slate-500 w-24">
                    {hour.is_closed ? 'Geschlossen' : 'Geöffnet'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pickup Slots */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-green-600" />
            Abholzeit-Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            Aktuelle Slots: {settings.pickup_slots.join(', ')}
          </p>
          <Input 
            value={settings.pickup_slots.join(', ')}
            onChange={(e) => setSettings({
              ...settings, 
              pickup_slots: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder="sofort, 15 min, 30 min, ..."
            data-testid="settings-slots-input"
          />
          <p className="text-xs text-slate-400 mt-2">
            Kommagetrennte Werte eingeben
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
