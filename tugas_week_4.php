<?php
 echo "<h1>Nama: Rafael Boaz Febrianto</h1>";


class Product {
    public $name;
    public $price;
    public $stock;

    public function __construct($name, $price, $stock) {
        $this->name = $name;
        $this->price = $price;
        $this->stock = $stock;
    }

    public function showInformation() {
        echo "Nama: {$this->name}, Harga: {$this->price}, Stock: {$this->stock}<br>";
    }
}

class ProductElectronic extends Product {
    public function calculateDiscount() {
        return $this->price * 0.5;
    }
}

class ProductFashion extends Product {
    public function calculateDiscount() {
        return $this->price * 0.3;
    }
}

$electronic = new ProductElectronic("Laptop", 10000, 23);
$electronic->showInformation();
echo "Harga setelah diskon: " . $electronic->calculateDiscount() . "<br><br>";

$fashion = new ProductFashion("Kaos", 7000, 3);
$fashion->showInformation();
echo "Harga setelah diskon: " . $fashion->calculateDiscount() . ".<br>";
?>