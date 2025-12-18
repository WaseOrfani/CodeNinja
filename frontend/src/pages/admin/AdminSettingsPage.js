import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Clock, MapPin, Phone, Mail, Save, Gift, QrCode } from 'lucide-react';
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
    ],
    qr_bonus: {
      enabled: true,
      bonus_type: 'extra_sauce',
      bonus_name: 'Gratis Extra Sauce',
      bonus_value: 0.80
    }
  });

  // Bonus type options
  const bonusTypes = [
    { value: 'extra_sauce', label: 'Gratis Extra Sauce', defaultName: 'Gratis Extra Sauce', defaultValue: 0.80 },
    { value: 'free_drink', label: 'Gratis Getränk', defaultName: 'Gratis Softdrink', defaultValue: 2.90 },
    { value: 'discount_10', label: '10% Rabatt', defaultName: '10% QR-Rabatt', defaultValue: 0 },
  ];

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

  const updateQRBonus = (field, value) => {
    setSettings(prev => ({
      ...prev,
      qr_bonus: { ...prev.qr_bonus, [field]: value }
    }));
  };

  const handleBonusTypeChange = (bonusType) => {
    const selected = bonusTypes.find(b => b.value === bonusType);
    setSettings(prev => ({
      ...prev,
      qr_bonus: {
        ...prev.qr_bonus,
        bonus_type: bonusType,
        bonus_name: selected?.defaultName || prev.qr_bonus.bonus_name,
        bonus_value: selected?.defaultValue ?? prev.qr_bonus.bonus_value
      }
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

      {/* QR Bonus Settings */}
      <Card className="border-purple-100 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="w-5 h-5 text-purple-600" />
            QR-Bonus System
          </CardTitle>
          <CardDescription>
            Automatischer Bonus für Bestellungen über QR-Code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                settings.qr_bonus?.enabled ? 'bg-purple-100' : 'bg-slate-100'
              }`}>
                <QrCode className={`w-5 h-5 ${settings.qr_bonus?.enabled ? 'text-purple-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="font-medium text-slate-900">QR-Bonus aktivieren</p>
                <p className="text-sm text-slate-500">
                  {settings.qr_bonus?.enabled 
                    ? 'Kunden erhalten Bonus bei QR-Bestellung' 
                    : 'QR-Bonus ist deaktiviert'}
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.qr_bonus?.enabled || false}
              onCheckedChange={(checked) => updateQRBonus('enabled', checked)}
              data-testid="qr-bonus-toggle"
            />
          </div>

          {settings.qr_bonus?.enabled && (
            <>
              {/* Bonus Type Selection */}
              <div>
                <Label className="text-slate-700">Bonus-Typ</Label>
                <Select 
                  value={settings.qr_bonus?.bonus_type || 'extra_sauce'} 
                  onValueChange={handleBonusTypeChange}
                >
                  <SelectTrigger className="mt-1" data-testid="qr-bonus-type-select">
                    <SelectValue placeholder="Bonus auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {bonusTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bonus Name */}
              <div>
                <Label className="text-slate-700">Bonus-Name (wird dem Kunden angezeigt)</Label>
                <Input 
                  value={settings.qr_bonus?.bonus_name || ''}
                  onChange={(e) => updateQRBonus('bonus_name', e.target.value)}
                  placeholder="z.B. Gratis Extra Sauce"
                  className="mt-1"
                  data-testid="qr-bonus-name-input"
                />
              </div>

              {/* Bonus Value */}
              {settings.qr_bonus?.bonus_type !== 'discount_10' && (
                <div>
                  <Label className="text-slate-700">Wert (€)</Label>
                  <Input 
                    type="number"
                    step="0.10"
                    min="0"
                    value={settings.qr_bonus?.bonus_value || 0}
                    onChange={(e) => updateQRBonus('bonus_value', parseFloat(e.target.value) || 0)}
                    placeholder="0.80"
                    className="mt-1 max-w-32"
                    data-testid="qr-bonus-value-input"
                  />
                  <p className="text-xs text-slate-400 mt-1">Wert des Bonus für Statistiken</p>
                </div>
              )}

              {/* Preview */}
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <p className="text-sm opacity-80 mb-1">Vorschau für Kunden:</p>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span className="font-bold text-lg">{settings.qr_bonus?.bonus_name || 'Gratis Extra Sauce'}</span>
                </div>
                <p className="text-sm opacity-80 mt-1">
                  🎉 Exklusiv bei QR-Bestellung!
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
