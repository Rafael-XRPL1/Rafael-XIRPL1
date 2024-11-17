<?php
include '../php/connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $nama_pembeli = $data['nama_pembeli'];
    $nomor_telephone = $data['nomor_telephone'];
    $tanggal_pembayaran = date('Y-m-d H:i:s');

    try {
        $query = "INSERT INTO riwayatpembayaran (nama_pembeli, nomor_telephone, tanggal_pembayaran)
                  VALUES (:nama_pembeli, :nomor_telephone, :tanggal_pembayaran)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            ':nama_pembeli' => $nama_pembeli,
            ':nomor_telephone' => $nomor_telephone,
            ':tanggal_pembayaran' => $tanggal_pembayaran
        ]);

        $deleteQuery = "DELETE FROM transaksipembelianmenu WHERE nama_pembeli = :nama_pembeli";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->execute([':nama_pembeli' => $nama_pembeli]);

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Gagal menyelesaikan transaksi: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Metode tidak diizinkan.']);
}
?>
