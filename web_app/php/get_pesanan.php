<?php
include '../php/connect.php';

try {
    $query = "SELECT * FROM transaksipembelianmenu";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}
?>
