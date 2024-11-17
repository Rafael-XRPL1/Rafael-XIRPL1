<?php
session_start();
include '../php/connect.php';
header('Content-Type: application/json');


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $email = $_GET['email'];
    $password = $_GET['password'];
    $role = $_GET['role'];

    try {
        if ($role === 'admin') {
            $stmt = $conn->prepare("SELECT * FROM admins WHERE email = ? AND password = ?");
        } else {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
        }
        $stmt->execute([$email, $password]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email atau password salah.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
