export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Impressum
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          ORIA FRESH GmbH<br />
          Musterstraße 123<br />
          12345 Berlin
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: +49 30 12345678<br />
          E-Mail: info@oriafresh.de
        </p>

        <h2>Vertreten durch</h2>
        <p>
          Geschäftsführer: Max Mustermann
        </p>

        <h2>Registereintrag</h2>
        <p>
          Eintragung im Handelsregister.<br />
          Registergericht: Amtsgericht Berlin-Charlottenburg<br />
          Registernummer: HRB 123456
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE123456789
        </p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Max Mustermann<br />
          Musterstraße 123<br />
          12345 Berlin
        </p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-green-600">
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
