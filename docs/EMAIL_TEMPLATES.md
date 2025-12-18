# ORIA FRESH – E-Mail Templates

## 1️⃣ Bestellbestätigung an Kunden

**Betreff:** `Deine Bestellung bei ORIA FRESH ist eingegangen 🍔`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
  
  <!-- Header -->
  <div style="background: #0f172a; padding: 30px; text-align: center;">
    <h1 style="margin: 0; color: white; font-size: 28px;">
      ORIA <span style="color: #22c55e;">FRESH</span>
    </h1>
    <p style="color: #94a3b8; margin: 10px 0 0;">Fresh Food. Real Taste.</p>
  </div>
  
  <!-- Content -->
  <div style="background: white; padding: 40px 30px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">✅</span>
      <h2 style="color: #22c55e; margin: 15px 0 5px;">Bestellung bestätigt!</h2>
    </div>
    
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">
      Hallo <strong>{{customer_name}}</strong>,
    </p>
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">
      danke für deine Bestellung bei ORIA FRESH! 🙌<br>
      Wir bereiten alles <strong>frisch</strong> für dich zu.
    </p>
    
    <!-- Order Info Box -->
    <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Bestellnummer:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0f172a; font-family: monospace;">
            #{{order_number}}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Abholzeit:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #22c55e;">
            {{pickup_time}}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Zahlung:</td>
          <td style="padding: 8px 0; text-align: right; color: #0f172a;">
            {{payment_method}}
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Order Items -->
    <h3 style="color: #0f172a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
      Deine Bestellung
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      {{#each order_items}}
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 0; color: #0f172a;">
          <strong>{{quantity}}x</strong> {{product_name}}<br>
          <span style="color: #64748b; font-size: 14px;">{{variant}}</span>
          {{#if extras}}
          <br><span style="color: #22c55e; font-size: 13px;">+ {{extras}}</span>
          {{/if}}
        </td>
        <td style="padding: 12px 0; text-align: right; color: #0f172a; font-weight: 500;">
          €{{total}}
        </td>
      </tr>
      {{/each}}
    </table>
    
    <!-- Total -->
    <div style="background: #22c55e; color: white; padding: 15px 20px; border-radius: 8px; margin-top: 20px;">
      <table style="width: 100%;">
        <tr>
          <td style="font-size: 18px; font-weight: bold;">Gesamtbetrag</td>
          <td style="text-align: right; font-size: 24px; font-weight: bold;">€{{order_total}}</td>
        </tr>
      </table>
    </div>
    
    <!-- Pickup Info -->
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 25px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>📍 Abholadresse:</strong><br>
        {{restaurant_address}}<br><br>
        <strong>📞 Fragen?</strong> {{restaurant_phone}}
      </p>
    </div>
    
    <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
      Bis gleich & guten Appetit! 🍔
    </p>
  </div>
  
  <!-- Footer -->
  <div style="background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
    © 2024 ORIA FRESH | 
    <a href="https://oriafresh.de" style="color: #22c55e; text-decoration: none;">oriafresh.de</a><br>
    <a href="https://oriafresh.de/impressum" style="color: #64748b;">Impressum</a> | 
    <a href="https://oriafresh.de/datenschutz" style="color: #64748b;">Datenschutz</a>
  </div>
  
</body>
</html>
```

---

## 2️⃣ Neue Bestellung – E-Mail an Restaurant/Küche

**Betreff:** `🍔 NEUE BESTELLUNG #{{order_number}} – Abholung {{pickup_time}}`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  
  <!-- Alert Header -->
  <div style="background: #22c55e; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🍔 NEUE BESTELLUNG!</h1>
  </div>
  
  <!-- Quick Info -->
  <div style="background: #0f172a; color: white; padding: 20px;">
    <table style="width: 100%;">
      <tr>
        <td style="font-size: 14px; color: #94a3b8;">Bestellnummer</td>
        <td style="font-size: 14px; color: #94a3b8;">Abholzeit</td>
        <td style="font-size: 14px; color: #94a3b8;">Zahlung</td>
      </tr>
      <tr>
        <td style="font-size: 20px; font-weight: bold; font-family: monospace;">#{{order_number}}</td>
        <td style="font-size: 20px; font-weight: bold; color: #22c55e;">{{pickup_time}}</td>
        <td style="font-size: 20px; font-weight: bold;">{{payment_status}}</td>
      </tr>
    </table>
  </div>
  
  <!-- Customer Info -->
  <div style="background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
    <table style="width: 100%;">
      <tr>
        <td>
          <strong style="color: #0f172a;">{{customer_name}}</strong><br>
          <a href="tel:{{customer_phone}}" style="color: #22c55e; font-size: 18px; font-weight: bold;">
            📞 {{customer_phone}}
          </a>
        </td>
        <td style="text-align: right;">
          <small style="color: #64748b;">{{customer_email}}</small>
        </td>
      </tr>
    </table>
  </div>
  
  <!-- Order Items -->
  <div style="padding: 20px;">
    <h3 style="margin: 0 0 15px; color: #0f172a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
      BESTELLUNG
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #22c55e; color: white;">
          <th style="padding: 10px; text-align: left;">Menge</th>
          <th style="padding: 10px; text-align: left;">Artikel</th>
          <th style="padding: 10px; text-align: right;">Preis</th>
        </tr>
      </thead>
      <tbody>
        {{#each order_items}}
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; font-size: 18px; font-weight: bold; color: #22c55e;">
            {{quantity}}x
          </td>
          <td style="padding: 12px 10px;">
            <strong style="color: #0f172a; font-size: 16px;">{{product_name}}</strong><br>
            <span style="color: #64748b;">{{variant}}</span>
            {{#if extras}}
            <br><span style="color: #22c55e; font-weight: 500;">+ {{extras}}</span>
            {{/if}}
          </td>
          <td style="padding: 12px 10px; text-align: right; font-weight: bold;">
            €{{total}}
          </td>
        </tr>
        {{/each}}
      </tbody>
      <tfoot>
        <tr style="background: #0f172a; color: white;">
          <td colspan="2" style="padding: 15px 10px; font-size: 18px; font-weight: bold;">
            GESAMT
          </td>
          <td style="padding: 15px 10px; text-align: right; font-size: 22px; font-weight: bold;">
            €{{order_total}}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  
  <!-- Customer Notes -->
  {{#if order_note}}
  <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 0 20px 20px;">
    <strong style="color: #92400e;">⚠️ HINWEIS VOM KUNDEN:</strong>
    <p style="margin: 10px 0 0; color: #92400e; font-size: 16px;">
      {{order_note}}
    </p>
  </div>
  {{/if}}
  
  <!-- Status Reminder -->
  <div style="background: #e0f2fe; padding: 15px 20px; margin: 20px; border-radius: 8px;">
    <p style="margin: 0; color: #0369a1; font-size: 14px;">
      <strong>👉 Status im Admin aktualisieren:</strong><br>
      <code style="background: white; padding: 2px 6px; border-radius: 4px;">paid</code> → 
      <code style="background: white; padding: 2px 6px; border-radius: 4px;">in_preparation</code> → 
      <code style="background: white; padding: 2px 6px; border-radius: 4px;">ready</code>
    </p>
  </div>
  
  <!-- Footer -->
  <div style="background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; font-size: 11px;">
    ORIA FRESH – Automatische Systemmeldung
  </div>
  
</body>
</html>
```

---

## Variablen-Referenz

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `{{customer_name}}` | Name des Kunden | Max Mustermann |
| `{{order_number}}` | Bestellnummer (8 Zeichen) | A1B2C3D4 |
| `{{pickup_time}}` | Gewählte Abholzeit | 15 min |
| `{{payment_method}}` | Zahlungsart (lesbar) | PayPal / Bar vor Ort |
| `{{payment_status}}` | Zahlungsstatus | BEZAHLT / OFFEN |
| `{{order_items}}` | Array der Bestellpositionen | - |
| `{{order_total}}` | Gesamtbetrag | 24.90 |
| `{{order_note}}` | Kundenhinweis | ohne Zwiebeln |
| `{{restaurant_address}}` | Adresse | Musterstr. 123, Berlin |
| `{{restaurant_phone}}` | Telefon | +49 30 12345678 |

---

## Integration in server.py

Die Templates sind bereits in `server.py` → `generate_order_email_html()` integriert.
Aktivierung durch Setzen von `RESEND_API_KEY` in `/app/backend/.env`.
