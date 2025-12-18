export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die über unseren Online-Shop 
          oriafresh.de getätigt werden. Die AGB gelten ausschließlich; entgegenstehende oder abweichende 
          Bedingungen des Kunden werden nicht anerkannt.
        </p>

        <h2>§ 2 Vertragspartner</h2>
        <p>
          Der Kaufvertrag kommt zustande mit ORIA FRESH GmbH, Musterstraße 123, 12345 Berlin.
        </p>

        <h2>§ 3 Vertragsschluss</h2>
        <p>
          Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine 
          Aufforderung zur Bestellung dar. Mit dem Absenden der Bestellung geben Sie ein verbindliches Angebot ab. 
          Die Bestellbestätigung per E-Mail stellt die Annahme Ihres Angebots dar.
        </p>

        <h2>§ 4 Preise und Zahlung</h2>
        <p>
          Alle Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer. Es fallen keine zusätzlichen 
          Versandkosten an, da es sich um Abholbestellungen handelt.
        </p>
        <p>
          Folgende Zahlungsmethoden stehen zur Verfügung:
        </p>
        <ul>
          <li>PayPal</li>
          <li>Zahlung bei Abholung (Bar oder Kartenzahlung)</li>
        </ul>

        <h2>§ 5 Abholung</h2>
        <p>
          Die bestellten Speisen können zur angegebenen Abholzeit an unserem Standort abgeholt werden. 
          Bitte halten Sie Ihre Bestellnummer bereit.
        </p>

        <h2>§ 6 Eigentumsvorbehalt</h2>
        <p>
          Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum der ORIA FRESH GmbH.
        </p>

        <h2>§ 7 Gewährleistung</h2>
        <p>
          Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln wenden Sie sich bitte umgehend an uns.
        </p>

        <h2>§ 8 Haftung</h2>
        <p>
          Für Schäden haftet die ORIA FRESH GmbH nur bei Vorsatz und grober Fahrlässigkeit. Dies gilt nicht für 
          Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
        </p>

        <h2>§ 9 Allergene und Zusatzstoffe</h2>
        <p>
          Informationen zu Allergenen und Zusatzstoffen finden Sie bei den jeweiligen Produktbeschreibungen. 
          Bei Fragen wenden Sie sich bitte an unser Personal.
        </p>

        <h2>§ 10 Schlussbestimmungen</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, sofern Sie Kaufmann sind 
          oder keinen allgemeinen Gerichtsstand in Deutschland haben.
        </p>
        
        <p className="text-slate-500 mt-8">
          Stand: Januar 2024
        </p>
      </div>
    </div>
  );
}
