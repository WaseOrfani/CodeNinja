export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Impressum
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          <strong>Hotel Ziegenkrug GmbH</strong>
        </p>
        
        <p>
          <strong>Hauptsitz:</strong><br />
          Rostocker Straße 22<br />
          18069 Lambrechtshagen / OT Sievershagen<br />
          Deutschland
        </p>
        
        <p>
          <strong>Standort ORIA FRESH:</strong><br />
          Kirchenplatz 9<br />
          18119 Rostock-Warnemünde<br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: +49 381 7704 – 0<br />
          Fax: +49 381 7697467<br />
          E-Mail: <a href="mailto:info@oriafresh.de" className="text-green-600">info@oriafresh.de</a>
        </p>

        <h2>Vertreten durch</h2>
        <p>
          Abdul Wase Orfani
        </p>

        <h2>Registereintrag</h2>
        <p>
          Eintragung im Handelsregister<br />
          Registergericht: Amtsgericht Rostock<br />
          Registernummer: HRB 11936
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE276563880
        </p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-green-600 ml-1">
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, 
          an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
          zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
      </div>
    </div>
  );
}
