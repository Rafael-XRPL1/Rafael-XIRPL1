<?php
include '../php/connect.php'; 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    error_log(print_r($data, true)); 

    if (empty($data['username']) || empty($data['email']) || 
        empty($data['password']) || empty($data['role']) || 
        empty($data['telephone'])) {
        echo json_encode(['success' => false, 'message' => 'Data tidak lengkap.']);
        exit(); 
    }

    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password']; 
    $role = $data['role'];
    $telephone = $data['telephone'];

    if (strtolower($role) === 'admin') {
        echo json_encode(['success' => false, 'message' => 'Registrasi dengan role admin tidak diperbolehkan.']);
        exit(); 
    }

    try {
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, title , phone_number) 
                                VALUES (:username, :email, :password, :role, :telephone)");

        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':telephone', $telephone);

        $stmt->execute();
        echo json_encode(['success' => true]);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Registrasi gagal: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Metode permintaan tidak valid.']);
}
?>
