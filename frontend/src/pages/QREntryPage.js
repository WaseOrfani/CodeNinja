import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * QR Entry Point - Ultra-fast redirect to QR Shop mode
 * URL: /qr or /qr?table=5
 */
export default function QREntryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get optional table number
    const table = searchParams.get('table');
    
    // Store QR mode in sessionStorage for the session
    sessionStorage.setItem('oria-qr-mode', 'true');
    if (table) {
      sessionStorage.setItem('oria-table', table);
    }
    
    // Redirect immediately to QR Shop
    navigate('/qr/shop', { replace: true });
  }, [navigate, searchParams]);

  // Minimal loading state (should be near instant)
  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="font-bold">Wird geladen...</p>
      </div>
    </div>
  );
}
