<?php
ob_start(); 
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include 'connect.php';
ob_end_clean(); 
try {
    $stmt = $conn->query("SELECT * FROM riwayatpembayaran");
    $riwayat = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($riwayat)) {
        echo json_encode(['message' => 'No records found.']);
    } else {
        echo json_encode($riwayat);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
