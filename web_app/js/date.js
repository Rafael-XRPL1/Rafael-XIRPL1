document.addEventListener("DOMContentLoaded", function() {
    function updateDate() {
        const now = new Date();
        
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const year = now.getFullYear();
        
        const formattedDate = `${day} ${month} ${year}`;
        
        document.getElementById("date").innerHTML = formattedDate;
    }
    updateDate();
});
