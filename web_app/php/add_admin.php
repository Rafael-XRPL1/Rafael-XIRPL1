<?php
include '../php/connect.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $role = htmlspecialchars($_POST['role']);
    $username = htmlspecialchars($_POST['username']);
    $email = htmlspecialchars($_POST['email']);
    $password = htmlspecialchars($_POST['password']);

    try {
        $stmt = $conn->prepare("INSERT INTO admins (role, username, email, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$role, $username, $email, $password]);

        echo json_encode(["Admin berhasil ditambahkan!"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    
    exit();
}
?>
