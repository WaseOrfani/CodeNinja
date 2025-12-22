<?php
/**
 * ORIA FRESH - Kontakt API
 */

$db = getDB();

switch ($requestMethod) {
    case 'POST':
        $data = getJsonInput();
        
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            jsonResponse(['error' => 'Name, E-Mail und Nachricht erforderlich'], 400);
        }
        
        $stmt = $db->prepare('INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['message']
        ]);
        
        // E-Mail an Admin
        $emailBody = "<h2>Neue Kontaktanfrage</h2>";
        $emailBody .= "<p><strong>Name:</strong> {$data['name']}<br>";
        $emailBody .= "<strong>E-Mail:</strong> {$data['email']}<br>";
        if (!empty($data['phone'])) {
            $emailBody .= "<strong>Telefon:</strong> {$data['phone']}<br>";
        }
        $emailBody .= "<strong>Nachricht:</strong><br>{$data['message']}</p>";
        
        sendEmail(ADMIN_EMAIL, 'Neue Kontaktanfrage - ORIA FRESH', $emailBody);
        
        jsonResponse(['message' => 'Nachricht gesendet'], 201);
        break;
        
    case 'GET':
        requireAuth();
        $stmt = $db->query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 50');
        jsonResponse($stmt->fetchAll());
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>