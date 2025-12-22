<?php
/**
 * ORIA FRESH - Kontaktformular API
 */

$db = getDB();
$submissionId = $segments[1] ?? null;

switch ($requestMethod) {
    case 'GET':
        // Admin: Alle Anfragen abrufen
        requireAuth();
        
        $stmt = $db->query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100');
        jsonResponse($stmt->fetchAll());
        break;
        
    case 'POST':
        // Neue Kontaktanfrage
        $data = getJsonInput();
        
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            jsonResponse(['error' => 'Name, E-Mail und Nachricht erforderlich'], 400);
        }
        
        $stmt = $db->prepare('
            INSERT INTO contact_submissions (name, email, phone, message) 
            VALUES (?, ?, ?, ?)
        ');
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'] ?? '',
            $data['message']
        ]);
        
        // E-Mail an Admin
        $emailBody = "
            <h2>Neue Kontaktanfrage bei ORIA FRESH</h2>
            <p><strong>Name:</strong> {$data['name']}</p>
            <p><strong>E-Mail:</strong> {$data['email']}</p>
            <p><strong>Telefon:</strong> " . ($data['phone'] ?? '-') . "</p>
            <p><strong>Nachricht:</strong></p>
            <p>" . nl2br(htmlspecialchars($data['message'])) . "</p>
        ";
        sendEmail(ADMIN_EMAIL, 'Neue Kontaktanfrage', $emailBody);
        
        jsonResponse(['message' => 'Anfrage gesendet'], 201);
        break;
        
    case 'PUT':
        // Als gelesen markieren
        requireAuth();
        if (!$submissionId) jsonResponse(['error' => 'ID erforderlich'], 400);
        
        $db->prepare('UPDATE contact_submissions SET is_read = 1 WHERE id = ?')->execute([$submissionId]);
        jsonResponse(['message' => 'Als gelesen markiert']);
        break;
        
    case 'DELETE':
        requireAuth();
        if (!$submissionId) jsonResponse(['error' => 'ID erforderlich'], 400);
        
        $db->prepare('DELETE FROM contact_submissions WHERE id = ?')->execute([$submissionId]);
        jsonResponse(['message' => 'Gelöscht']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>