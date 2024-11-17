<?php
include '../php/connect.php'; 

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$customerName = $data['customerName'] ?? '';
$customerPhone = $data['customerPhone'] ?? '';
$address = $data['address'] ?? '';
$paymentMethod = $data['paymentMethod'] ?? '';
$totalPrice = isset($data['totalPrice']) ? floatval($data['totalPrice']) : 0;
$items = $data['items'] ?? [];

if (!is_numeric($totalPrice) || $totalPrice <= 0) {
    echo json_encode(['success' => false, 'error' => 'Total harga harus berupa angka desimal.']);
    exit;
}

try {
    $conn->beginTransaction();
    $insertTransaction = "
        INSERT INTO transaksipembelianmenu (nama_pembeli, nomor_telephone, alamat, metode_pembayaran, total_harga) 
        VALUES (:nama_pembeli, :nomor_telephone, :alamat, :metode_pembayaran, :total_harga)
    ";

    $stmt = $conn->prepare($insertTransaction);
    $stmt->execute([
        ':nama_pembeli' => $customerName,
        ':nomor_telephone' => $customerPhone,
        ':alamat' => $address,
        ':metode_pembayaran' => $paymentMethod,
        ':total_harga' => $totalPrice
    ]);

    $transactionId = $conn->lastInsertId();

    $insertItem = "
        INSERT INTO detail_transaksi (transaction_id, menu_name, quantity) 
        VALUES (:transaction_id, :menu_name, :quantity)
    ";
    $stmtItem = $conn->prepare($insertItem);

    foreach ($items as $item) {
        if (isset($item['name']) && isset($item['quantity'])) {
            $stmtItem->execute([
                ':transaction_id' => $transactionId,
                ':menu_name' => $item['name'],
                ':quantity' => $item['quantity']
            ]);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
