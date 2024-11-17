<?php
include '../php/connect.php'; 
header('Content-Type: application/json');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Menangani pengiriman pesan
    if (isset($_POST['message'])) {
        $message = $_POST['message'];
        try {
            $stmt = $conn->prepare("INSERT INTO comments (message) VALUES (:message)");
            $stmt->bindParam(':message', $message);
            $stmt->execute();
            $lastId = $conn->lastInsertId(); 
            echo json_encode(['success' => true, 'id' => $lastId]); 
        } catch (PDOException $e) {
            error_log("Error: " . $e->getMessage());
            echo json_encode(['success' => false, 'error' => 'Gagal menyimpan pesan.']);
        }
    } 
    // Menangani like dan dislike
    elseif (isset($_POST['type']) && isset($_POST['id']) && isset($_POST['increment'])) {
        $type = $_POST['type'];
        $id = $_POST['id'];
        $increment = $_POST['increment'];

        try {
            $column = $type === 'like' ? 'likes' : 'dislikes';
            $stmt = $conn->prepare("UPDATE comments SET $column = $column + :increment WHERE id = :id");
            $stmt->bindParam(':increment', $increment, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Pesan tidak ditemukan.']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM comments ORDER BY created_at DESC");
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($comments);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    if (isset($_DELETE['id'])) { 
        $id = $_DELETE['id'];
        try {
            $stmt = $conn->prepare("DELETE FROM comments WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'ID pesan tidak ditemukan.']);
    }
}
?>
