import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Nachricht gesendet! Wir werden uns bald bei Ihnen melden.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Kontakt</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Haben Sie Fragen oder möchten Sie Feedback geben? Wir freuen uns, von Ihnen zu hören.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1B4B73] mb-6">So erreichen Sie uns</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#1B4B73] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#E8A54B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#1B4B73]">Telefon</h3>
                    <p className="text-gray-600">+49 30 1234567</p>
                    <p className="text-sm text-gray-500">Mo-Fr: 9:00 - 18:00 Uhr</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#1B4B73] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#E8A54B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#1B4B73]">E-Mail</h3>
                    <p className="text-gray-600">info@oriagrill.de</p>
                    <p className="text-sm text-gray-500">Wir antworten innerhalb von 24 Stunden</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#1B4B73] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#E8A54B]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#1B4B73]">Hauptsitz</h3>
                    <p className="text-gray-600">Friedrichstraße 123</p>
                    <p className="text-gray-600">10117 Berlin</p>
                  </div>
                </div>
              </div>

              {/* Additional Links */}
              <div className="mt-12">
                <h3 className="text-lg font-bold text-[#1B4B73] mb-4">Weitere Anfragen</h3>
                <div className="space-y-3">
                  <a href="/careers" className="block text-[#1B4B73] hover:text-[#E8A54B] transition-colors">
                    → Karriere & Stellenangebote
                  </a>
                  <a href="/franchise" className="block text-[#1B4B73] hover:text-[#E8A54B] transition-colors">
                    → Franchise-Möglichkeiten
                  </a>
                  <a href="/catering" className="block text-[#1B4B73] hover:text-[#E8A54B] transition-colors">
                    → Catering-Anfragen
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#1B4B73] mb-6">Schreiben Sie uns</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ihr Name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ihre@email.de"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Betreff *</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Ihre Nachricht..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1B4B73] hover:bg-[#163d5e] text-white py-3"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Nachricht senden
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
