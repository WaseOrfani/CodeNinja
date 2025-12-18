import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { QrCode, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQRPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Base URL for QR ordering
  const baseUrl = window.location.origin;
  const qrUrl = tableNumber 
    ? `${baseUrl}/qr?table=${tableNumber}`
    : `${baseUrl}/qr`;
  
  // QR Code API (using qrserver.com for simplicity)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`;
  
  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    toast.success('URL kopiert!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = tableNumber ? `oria-qr-tisch-${tableNumber}.png` : 'oria-qr-allgemein.png';
    link.click();
    toast.success('QR-Code heruntergeladen!');
  };
  
  const openQRPage = () => {
    window.open(qrUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">QR-Bestellung</h1>
        <p className="text-slate-500 mt-1">QR-Codes für Tischbestellung generieren</p>
      </div>

      {/* Generator */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-green-600" />
            QR-Code Generator
          </CardTitle>
          <CardDescription>
            Erstelle QR-Codes für schnelle Bestellungen direkt am Tisch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table Number Input */}
          <div>
            <Label htmlFor="table">Tischnummer (optional)</Label>
            <Input 
              id="table"
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="z.B. 5"
              className="mt-1 max-w-32"
              data-testid="qr-table-input"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leer lassen für allgemeinen QR-Code
            </p>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl">
            <img 
              src={qrImageUrl}
              alt="QR Code"
              className="w-48 h-48 mb-4"
            />
            <p className="text-sm text-slate-600 text-center break-all max-w-full">
              {qrUrl}
            </p>
            {tableNumber && (
              <p className="text-lg font-bold text-purple-600 mt-2">
                Tisch {tableNumber}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={downloadQR} className="bg-green-500 hover:bg-green-600" data-testid="qr-download-btn">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyUrl} variant="outline" data-testid="qr-copy-btn">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Kopiert!' : 'URL kopieren'}
            </Button>
            <Button onClick={openQRPage} variant="outline" data-testid="qr-preview-btn">
              <ExternalLink className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">So funktioniert's</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>QR-Code generieren (mit oder ohne Tischnummer)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>QR-Code ausdrucken und auf Tisch/Theke platzieren</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>Kunde scannt → bestellt → zahlt (oder bei Abholung)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <span>Bestellung erscheint im Admin mit <span className="bg-purple-100 text-purple-700 px-1 rounded text-xs font-bold">QR</span> Label</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-green-100 bg-green-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-800 mb-2">💡 Tipps</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• QR-Codes auf wasserfestes Material drucken</li>
            <li>• Mindestgröße 3x3 cm für gutes Scannen</li>
            <li>• Auf jedem Tisch einen individuellen Code platzieren</li>
            <li>• QR-Bestellungen sind im Dashboard separat sichtbar</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
