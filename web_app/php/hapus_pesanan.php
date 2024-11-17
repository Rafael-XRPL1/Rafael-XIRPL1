<?php
include '../php/connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $nama_pembeli = $data['nama_pembeli'];

    error_log("Nama Pembeli yang Diterima: " . $nama_pembeli);

    try {
        $query = "DELETE FROM transaksipembelianmenu WHERE nama_pembeli = :nama_pembeli";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':nama_pembeli', $nama_pembeli);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Pesanan tidak ditemukan untuk nama ini.']);
        }
    } catch (PDOException $e) {
        error_log("Kesalahan saat menghapus: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Metode tidak diizinkan.']);
}
?>
