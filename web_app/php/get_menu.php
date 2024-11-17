<?php
include 'connect.php'; 

$kategori = $_GET['kategori'];

if ($kategori == 'makanan') {
    $sql = "SELECT nama_makanan AS nama_menu, deskripsi, harga FROM makanan";
} else if ($kategori == 'minuman') {
    $sql = "SELECT nama_minuman AS nama_menu, deskripsi, harga FROM minuman";
} else {
    echo json_encode([]); 
    exit();
}

$stmt = $conn->query($sql);
$menu = [];

if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $menu[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($menu);
?>
