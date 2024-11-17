document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('transaksi_list').addEventListener('click', function () {
        showView('transaksi');
        loadTransactions();
    });

    document.getElementById('riwayat_list').addEventListener('click', function () {
        showView('riwayat');
        loadHistory();
    });

    function showView(viewId) {
        const views = ['transaksi', 'riwayat'];
        views.forEach(view => {
            document.getElementById(view).style.display = (view === viewId) ? 'block' : 'none';
        });
    }

    loadTransactions();
    showView('transaksi');

    function loadTransactions() {
        fetch('../php/get_transaksi.php')
            .then(response => response.json())
            .then(transactions => {
                const transaksiDiv = document.getElementById('transaksi');
                transaksiDiv.innerHTML = '<h2>List Pembayaran</h2>';

                if (transactions.length === 0) {
                    transaksiDiv.innerHTML += '<p>Belum ada kegiatan pembayaran</p>';
                } else {
                    transactions.forEach(transaction => {
                        const item = document.createElement('div');
                        item.innerHTML = `
                            <p><strong>Nama Pembeli:</strong> ${transaction.nama_pembeli}</p>
                            <p><strong>Total Harga:</strong> ${transaction.total_harga}</p>
                            <p><strong>Alamat:</strong> ${transaction.alamat}</p>
                            <p><strong>Nomor Telepon:</strong> ${transaction.nomor_telephone}</p>
                            <button class="lunas-btn">Lunas</button>
                        `;

                        item.querySelector('.lunas-btn').addEventListener('click', () => {
                            moveToHistory(transaction);
                        });

                        transaksiDiv.appendChild(item);
                    });
                }
            })
            .catch(error => console.error('Error loading transactions:', error));
    }

    function moveToHistory(transaction) {
        const confirmation = confirm(`Apakah pembayaran untuk ${transaction.nama_pembeli} sudah lunas?`);
        if (confirmation) {
            fetch('../php/simpan_transaksi.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Transaksi selesai');
                        loadTransactions();
                    } else {
                        alert('Gagal menyelesaikan transaksi: ' + data.error);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }

    function loadHistory() {
        fetch('../php/get_riwayat.php')
            .then(response => response.text())
            .then(text => {
                try {
                    const historyList = JSON.parse(text);
                    const historyDiv = document.getElementById('riwayat');
                    historyDiv.innerHTML = '<h2>Riwayat Penghapus</h2>';

                    const historyTable = document.createElement('table');
                    const historyTableBody = document.createElement('tbody');
                    historyTable.appendChild(historyTableBody);
                    historyDiv.appendChild(historyTable);

                    if (historyList.length === 0) {
                        historyTableBody.innerHTML = '<p colspan="3">Belum ada list pembayaran yang lunas</p>';
                    } else {
                        historyList.forEach(history => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <ul>
                                    <li>${history.nama_pembeli}</li>
                                    <p>${history.nomor_telephone}</p>
                                    <p>${history.tanggal_pembayaran}</p>
                                </ul>
                            `;
                            historyTableBody.appendChild(row);
                        });
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            })
            .catch(error => console.error('Error loading history list:', error));
    }
});
