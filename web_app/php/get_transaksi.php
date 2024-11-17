<?php
include '../php/connect.php';

try {
    $query = "SELECT nama_pembeli, nomor_telephone, alamat, total_harga FROM transaksipembelianmenu";
    $stmt = $conn->query($query);
    $transaksi = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($transaksi);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Gagal memuat data: ' . $e->getMessage()]);
}
?>
