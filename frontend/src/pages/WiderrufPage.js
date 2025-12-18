export default function WiderrufPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Widerrufsbelehrung
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
        </p>
        <p>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
        </p>
        <p>
          Hotel Ziegenkrug GmbH (ORIA FRESH)<br />
          Kirchenplatz 9<br />
          18119 Rostock-Warnemünde<br />
          Telefon: +49 381 7704 – 0<br />
          E-Mail: info@oriafresh.de
        </p>
        <p>
          mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren 
          Entschluss, diesen Vertrag zu widerrufen, informieren.
        </p>

        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, 
          unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über 
          Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion 
          eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall 
          werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>

        <h2>Ausschluss des Widerrufsrechts</h2>
        <p>
          Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die schnell verderben können 
          oder deren Verfallsdatum schnell überschritten würde.
        </p>
        <p>
          <strong>Hinweis:</strong> Da es sich bei unseren Produkten um frisch zubereitete Speisen handelt, die 
          schnell verderben können, ist ein Widerruf nach Zubereitung der Speisen ausgeschlossen.
        </p>

        <h2>Stornierung vor Zubereitung</h2>
        <p>
          Sollten Sie Ihre Bestellung vor Beginn der Zubereitung stornieren wollen, kontaktieren Sie uns bitte 
          umgehend telefonisch unter +49 381 7704 – 0. Wir werden versuchen, Ihre Stornierung zu berücksichtigen.
        </p>

        <h2>Muster-Widerrufsformular</h2>
        <p>
          (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
        </p>
        <div className="bg-slate-50 p-6 rounded-lg">
          <p>
            An: Hotel Ziegenkrug GmbH (ORIA FRESH), Kirchenplatz 9, 18119 Rostock-Warnemünde, E-Mail: info@oriafresh.de
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der 
            folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
          </p>
          <p>
            Bestellt am (*)/erhalten am (*): _______________
          </p>
          <p>
            Name des/der Verbraucher(s): _______________
          </p>
          <p>
            Anschrift des/der Verbraucher(s): _______________
          </p>
          <p>
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _______________
          </p>
          <p>
            Datum: _______________
          </p>
          <p className="text-sm text-slate-500">
            (*) Unzutreffendes streichen.
          </p>
        </div>
      </div>
    </div>
  );
}
