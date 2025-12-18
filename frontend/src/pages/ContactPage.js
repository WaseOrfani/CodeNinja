import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Nachricht gesendet! Wir melden uns bald bei dir.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
            Kontakt
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Hast du Fragen? Wir sind für dich da!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Schreib uns</h2>
            <p className="text-slate-500 mb-8">
              Ob Feedback, Fragen oder Catering-Anfragen - wir freuen uns auf deine Nachricht!
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Standort ORIA FRESH</h3>
                  <p className="text-slate-500">Kirchenplatz 9</p>
                  <p className="text-slate-500">18119 Rostock-Warnemünde</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Telefon</h3>
                  <a href="tel:+493817704-0" className="text-slate-500 hover:text-green-600">
                    +49 381 7704 – 0
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">E-Mail</h3>
                  <a href="mailto:info@oriafresh.de" className="text-slate-500 hover:text-green-600">
                    info@oriafresh.de
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700">Name *</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Dein Name"
                    className="h-12 mt-1"
                    required
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-700">E-Mail *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="max@example.com"
                    className="h-12 mt-1"
                    required
                    data-testid="contact-email-input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-slate-700">Betreff *</Label>
                <Input 
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Worum geht es?"
                  className="h-12 mt-1"
                  required
                  data-testid="contact-subject-input"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-slate-700">Nachricht *</Label>
                <Textarea 
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Deine Nachricht..."
                  className="mt-1"
                  rows={5}
                  required
                  data-testid="contact-message-input"
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  'Wird gesendet...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Nachricht senden
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
