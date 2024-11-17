document.addEventListener('DOMContentLoaded', function () {
    let selectedItems = [];
    let totalPrice = 0;

    document.getElementById('addpesananBtn').addEventListener('click', function () {
        showView('addPesanan');
    });

    document.getElementById('addkeranjangBtn').addEventListener('click', function () {
        showView('daftarPesanan');
        loadOrderList();
    });

    document.getElementById('addmenuBtn').addEventListener('click', function () {
        showView('tambahMenu');
    });

    document.getElementById('kategori').addEventListener('change', function () {
        loadMenu(this.value);
    });

    document.getElementById('metode_pembelian').addEventListener('change', function () {
        updatePaymentInput(this.value);
    });

    document.getElementById('orderForm').addEventListener('submit', function (e) {
        e.preventDefault();
        submitOrder();
    });

    function showView(viewId) {
        const views = ['addPesanan', 'daftarPesanan', 'tambahMenu'];
        views.forEach(view => {
            document.getElementById(view).style.display = (view === viewId) ? 'block' : 'none';
        });
    }

    function loadMenu(kategori) {
        fetch(`../php/get_menu.php?kategori=${kategori}`)
            .then(response => response.json())
            .then(menuItems => {
                const menuTable = document.getElementById('menuTable').querySelector('tbody');
                menuTable.innerHTML = '';

                menuItems.forEach(item => {
                    const isSelected = selectedItems.some(selectedItem => selectedItem.name === item.nama_menu);
                    const quantity = isSelected ? selectedItems.find(selectedItem => selectedItem.name === item.nama_menu).quantity : 1;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.nama_menu}</td>
                        <td>${item.harga}</td>
                        <td><input type="number" min="1" value="${quantity}" id="qty-${item.nama_menu}" onchange="updateQuantity('${item.nama_menu}', ${item.harga})"></td>
                        <td><input type="checkbox" id="checkbox-${item.nama_menu}" ${isSelected ? 'checked' : ''} onchange="toggleSelection('${item.nama_menu}', ${item.harga})"></td>
                    `;
                    menuTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading menu:', error));
    }

    window.toggleSelection = function (name, price) {
        const checkbox = document.getElementById(`checkbox-${name}`);
        const quantityInput = document.getElementById(`qty-${name}`);
        const quantity = parseInt(quantityInput.value);

        if (checkbox.checked) {
            addItem(name, price, quantity);
        } else {
            removeItem(name);
        }
    };

    function addItem(name, price, quantity) {
        const existingItemIndex = selectedItems.findIndex(item => item.name === name);
        if (existingItemIndex === -1) {
            selectedItems.push({ name, price, quantity });
        } else {
            selectedItems[existingItemIndex].quantity = quantity;
        }
        updateSelectedItems();
    }

    function removeItem(name) {
        selectedItems = selectedItems.filter(item => item.name !== name);
        updateSelectedItems();
    }

    function updateSelectedItems() {
        const selectedItemsList = document.getElementById('selectedItemsList');
        const totalPriceElement = document.getElementById('totalPrice');
        selectedItemsList.innerHTML = '';
        totalPrice = 0;
    
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Nama Menu</th>
            <th>Jumlah</th>
            <th>Harga</th>
        `;
        table.appendChild(headerRow);
    
        selectedItems.forEach(item => {
            const listItemRow = document.createElement('tr');
            listItemRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
            `;
            table.appendChild(listItemRow);
            totalPrice += item.price * item.quantity;
        });
    
        selectedItemsList.appendChild(table);
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }    

    window.updateQuantity = function (name, price) {
        const quantityInput = document.getElementById(`qty-${name}`);
        const quantity = parseInt(quantityInput.value);
        const existingItemIndex = selectedItems.findIndex(item => item.name === name);

        if (existingItemIndex !== -1) {
            selectedItems[existingItemIndex].quantity = quantity;
        }
        updateSelectedItems();
    };

    function submitOrder() {
        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const address = document.getElementById('alamat').value;
        const paymentMethod = document.getElementById('metode_pembelian').value;
        const totalPrice = parseFloat(document.getElementById('totalPrice').textContent);

        if (selectedItems.length === 0) {
            alert('Silakan pilih setidaknya satu item untuk dipesan.');
            return;
        }

        fetch('../php/proses_pesanan.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName,
                customerPhone,
                address,
                paymentMethod,
                totalPrice: totalPrice.toFixed(2),
                items: selectedItems
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Pesanan berhasil ditambahkan!');
                resetOrder();
                showView('daftarPesanan');
                loadOrderList();
            } else {
                alert('Terjadi kesalahan: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function resetOrder() {
        document.getElementById('orderForm').reset();
        selectedItems = [];
        totalPrice = 0;
        updateSelectedItems();
    }

    function loadOrderList() {
        fetch('../php/get_pesanan.php')
            .then(response => response.json())
            .then(orderList => {
                const orderTable = document.getElementById('orderTable').querySelector('tbody');
                orderTable.innerHTML = '';

                orderList.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <p>${order.nama_pembeli}</p>
                        <p>${order.nomor_telephone}</p>
                        <p>${order.alamat}</p>
                        <p>${order.total_harga}</p>
                    `;

                    row.addEventListener('click', () => confirmOrderDeletion(order.nama_pembeli));
                    orderTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading order list:', error));
    }

    function confirmOrderDeletion(nama_pembeli) {
        const confirmation = confirm(`Apakah Anda yakin ingin membatalkan pesanan untuk ${nama_pembeli}?`);
        if (confirmation) {
            deleteOrder(nama_pembeli);
        }
    }

    function deleteOrder(nama_pembeli) {
        fetch('../php/hapus_pesanan.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama_pembeli })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Pesanan untuk ${nama_pembeli} berhasil dihapus!`);
                    loadOrderList();
                } else {
                    alert('Gagal menghapus pesanan: ' + data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function updatePaymentInput(method) {
        const paymentDetails = document.getElementById('paymentDetails');
        paymentDetails.innerHTML = '';

        if (method === 'online') {
            paymentDetails.innerHTML = `
                <label for="onlineMethod">Pilih Metode:</label>
                <p>Coming soon</p>
            `;
        }
    }
});
