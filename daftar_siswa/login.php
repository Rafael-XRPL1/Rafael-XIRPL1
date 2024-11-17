<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $nama = $_POST["nama"];
    $nis = $_POST["nis"];
    $jenis_kelamin = $_POST["jenis_kelamin"];
    $kelas = $_POST["kelas"];
    $jurusan = $_POST["jurusan"];
    $keahlian = isset($_POST["keahlian"]) ? $_POST["keahlian"] : "";
    $sebutkan = isset($_POST["sebutkan"]) ? $_POST["sebutkan"] : "";

    // Handling photo upload
    $photo_dir = "uploads/";
    $photo_path = $photo_dir . basename($_FILES["photo"]["name"]);
    $photo_upload_ok = 1;
    $image_file_type = strtolower(pathinfo($photo_path, PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["photo"]["tmp_name"]);
    if ($check !== false) {
        $photo_upload_ok = 1;
    } else {
        echo "File is not an image.";
        $photo_upload_ok = 0;
    }

    // Check if file already exists
    if (file_exists($photo_path)) {
        echo "Sorry, file already exists.";
        $photo_upload_ok = 0;
    }

    // Check file size
    if ($_FILES["photo"]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $photo_upload_ok = 0;
    }

    // Allow certain file formats
    if ($image_file_type != "jpg" && $image_file_type != "png" && $image_file_type != "jpeg"
    && $image_file_type != "gif" ) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $photo_upload_ok = 0;
    }

    // Check if $photo_upload_ok is set to 0 by an error
    if ($photo_upload_ok == 0) {
        echo "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
    } else {
        // Ensure the directory exists
        if (!file_exists($photo_dir)) {
            mkdir($photo_dir, 0777, true); // Create the directory if it doesn't exist
        }

        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $photo_path)) {
            // Save data to text file in the same directory
            $document_path = $photo_dir . "Document.txt";
            $file = fopen($document_path, "a");
            fwrite($file, "Nama: $nama\n");
            fwrite($file, "Nis: $nis\n");
            fwrite($file, "Photo: $photo_path\n");
            fwrite($file, "Jenis Kelamin: $jenis_kelamin\n");
            fwrite($file, "Kelas: $kelas\n");
            fwrite($file, "Jurusan: $jurusan\n");
            fwrite($file, "Keahlian: $keahlian\n");
            fwrite($file, "Keahlian Lainnya: $sebutkan\n");
            fwrite($file, "\n");
            fclose($file);

            // Display confirmation and data
            echo "<h1>Terima kasih, $nama</h1>\n";
            echo "<p>Kami telah menyimpan data anda</p>\n";

            echo "<table border='1' style='margin-bottom: 20px'>
                <tr style='background-color: blue; color: white; font-family: Arial Narrow Bold;'>
                    <td align='center' style='width: 200px;'>NAMA</td>
                    <td align='center' style='width: 100px;'>NIS</td>
                    <td align='center' style='width: 100px;'>KELAS</td>
                    <td align='center' style='width: 100px;'>JURUSAN</td>
                    <td align='center' style='width: 100px;'>JENIS KELAMIN</td>
                </tr>
                <tr style='background-color: green; color: white; font-family: Arial Narrow Bold;'>
                    <td align='center'>$nama</td>
                    <td align='center'>$nis</td>
                    <td align='center'>$kelas</td>
                    <td align='center'>$jurusan</td>
                    <td align='center'>$jenis_kelamin</td>
                </tr>
            </table>\n";

            echo "<h2>Silahkan cek kembali data anda:</h2>\n";
            echo "<li>Nama Lengkap: $nama\n</li>";
            echo "<li>Nis: $nis\n</li>";
            echo "<li>Photo: <img src='$photo_path' alt='Photo' width='100'>\n</li>";
            echo "<li>Jenis Kelamin: $jenis_kelamin\n</li>";
            echo "<li>Kelas: $kelas\n</li>";
            echo "<li>Jurusan: $jurusan\n</li>";
            echo "<li>Keahlian $nama adalah: $keahlian\n</li>";
            echo "<li>Keahlian Lainnya: $sebutkan\n</li>";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
} else {
    echo "Data anda kurang lengkap!";
}
?>
