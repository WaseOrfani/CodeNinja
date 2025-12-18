export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-8">
        Datenschutzerklärung
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>1. Datenschutz auf einen Blick</h2>
        
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
          passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
          persönlich identifiziert werden können.
        </p>

        <h3>Datenerfassung auf dieser Website</h3>
        <p>
          <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
          können Sie dem Impressum dieser Website entnehmen.
        </p>

        <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
        <p>
          Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, 
          werden auf den Servern des Hosters gespeichert.
        </p>

        <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
        
        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre 
          personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie 
          dieser Datenschutzerklärung.
        </p>

        <h3>Hinweis zur verantwortlichen Stelle</h3>
        <p>
          Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
          ORIA FRESH GmbH<br />
          Musterstraße 123<br />
          12345 Berlin<br /><br />
          Telefon: +49 30 12345678<br />
          E-Mail: info@oriafresh.de
        </p>

        <h2>4. Datenerfassung auf dieser Website</h2>
        
        <h3>Cookies</h3>
        <p>
          Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf 
          Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
          (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
        </p>

        <h3>Bestelldaten</h3>
        <p>
          Wenn Sie bei uns bestellen, erheben wir folgende Daten:
        </p>
        <ul>
          <li>Name</li>
          <li>Telefonnummer</li>
          <li>E-Mail-Adresse</li>
          <li>Bestelldetails</li>
        </ul>
        <p>
          Diese Daten werden ausschließlich zur Abwicklung Ihrer Bestellung verwendet und nach Abschluss des 
          Bestellvorgangs gemäß den gesetzlichen Aufbewahrungsfristen gespeichert.
        </p>

        <h2>5. Zahlungsanbieter</h2>
        
        <h3>PayPal</h3>
        <p>
          Auf dieser Website bieten wir u.a. die Bezahlung via PayPal an. Anbieter dieses Zahlungsdienstes ist 
          die PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
          gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder 
          Löschung dieser Daten zu verlangen.
        </p>
      </div>
    </div>
  );
}
