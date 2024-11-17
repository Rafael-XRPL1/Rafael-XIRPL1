document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addAdminBtn').addEventListener('click', function() {
        document.getElementById('addAdmin').style.display = 'block';
        document.getElementById('viewAdmin').style.display = 'none';
    });

    document.getElementById('viewAdminBtn').addEventListener('click', function() {
        document.getElementById('addAdmin').style.display = 'none';
        document.getElementById('viewAdmin').style.display = 'block';
        loadAdminList();  
    });

   
    document.getElementById('addAdminForm').addEventListener('submit', function(event) {
        event.preventDefault();  

        const formData = new FormData(this);

        fetch('../php/add_admin.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);  
            loadAdminList();  
            this.reset();  
            document.getElementById('viewAdminBtn').click();  
        })
        .catch(error => console.error('Error:', error));  
    });

    
    function loadAdminList() {
        fetch('../php/admin_list.php')
            .then(response => response.text())
            .then(data => {
                document.getElementById('adminList').innerHTML = data;  
            })
            .catch(error => console.error('Error memuat daftar admin:', error)); 
    }

    loadAdminList();
});
