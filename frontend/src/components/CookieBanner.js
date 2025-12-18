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

  // Check if we're on QR pages - use more compact styling
  const isQRPage = window.location.pathname.startsWith('/qr');

  return (
    <div className={`fixed left-4 right-4 z-[60] animate-slide-up ${
      isQRPage 
        ? 'bottom-36 md:bottom-4' // Above the fixed order button on QR pages
        : 'bottom-4 md:bottom-4'
    } md:left-auto md:right-4 md:max-w-md`}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1.5 text-sm md:text-base">🍪 Cookies & Datenschutz</h3>
            <p className="text-xs md:text-sm text-slate-500 mb-3">
              Nur technisch notwendige Cookies für Warenkorb und Bestellung. 
              <a href="/datenschutz" className="text-green-600 hover:underline ml-1">Mehr erfahren</a>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={acceptCookies}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 h-9 text-sm"
                data-testid="cookie-accept-btn"
              >
                Verstanden
              </Button>
              <Button 
                onClick={declineCookies}
                variant="outline"
                className="rounded-full px-4 h-9 text-sm"
                data-testid="cookie-decline-btn"
              >
                Nur notwendige
              </Button>
            </div>
          </div>
          <button 
            onClick={declineCookies}
            className="text-slate-400 hover:text-slate-600 mt-1"
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
