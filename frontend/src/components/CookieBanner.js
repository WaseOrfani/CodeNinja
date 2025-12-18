import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('oria-cookie-consent');
    if (!consent) {
      // Small delay to avoid showing immediately on page load
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('oria-cookie-consent', 'accepted');
    localStorage.setItem('oria-cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('oria-cookie-consent', 'declined');
    localStorage.setItem('oria-cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">🍪 Cookies & Datenschutz</h3>
            <p className="text-sm text-slate-500 mb-4">
              Wir verwenden nur technisch notwendige Cookies für den Warenkorb und deine Bestellung. 
              Keine Tracking-Cookies. Mehr dazu in unserer{' '}
              <a href="/datenschutz" className="text-green-600 hover:underline">Datenschutzerklärung</a>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={acceptCookies}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
                data-testid="cookie-accept-btn"
              >
                Verstanden
              </Button>
              <Button 
                onClick={declineCookies}
                variant="outline"
                className="rounded-full px-6"
                data-testid="cookie-decline-btn"
              >
                Nur notwendige
              </Button>
            </div>
          </div>
          <button 
            onClick={declineCookies}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
