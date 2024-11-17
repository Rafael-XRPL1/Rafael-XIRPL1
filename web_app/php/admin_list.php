<?php
include '../php/connect.php';

try {
    $stmt = $conn->prepare("SELECT * FROM admins");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($result) > 0) {
        echo "<table>";
        echo "<tr><th>ID</th><th>Role</th><th>Username</th><th>Email</th><th>Password</th></tr>";

        foreach ($result as $row) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['id']) . "</td>";
            echo "<td>" . htmlspecialchars($row['role']) . "</td>";
            echo "<td>" . htmlspecialchars($row['username']) . "</td>";
            echo "<td>" . htmlspecialchars($row['email']) . "</td>";
            echo "<td>" . htmlspecialchars($row['password']) . "</td>"; 
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "Tidak ada admin yang ditemukan.";
    }

    $stmt = null;
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?>
