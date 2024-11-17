document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const messageList = document.getElementById("messageList");

    function showView(viewId) {
        const views = ['kesanPesan', 'informasi'];
        views.forEach(view => {
            document.getElementById(view).style.display = (view === viewId) ? 'block' : 'none';
        });
    }

    document.getElementById('kesanpesanBtn').addEventListener('click', function () {
        showView('kesanPesan');
    });

    document.getElementById('informasiBtn').addEventListener('click', function () {
        showView('informasi');
    });

    showView('kesanPesan');
    loadMessages();

    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            addMessage(`${message} (${new Date().toLocaleTimeString()})`);
            messageInput.value = "";
        }
    });

    function loadMessages() {
        fetch('../php/message.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(msg => displayMessage(msg.id, msg.message, msg.likes, msg.dislikes));
            })
            .catch(error => console.error("Error:", error));
    }

    function addMessage(message) {
        fetch('../php/message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ message })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    displayMessage(data.id, message, 0, 0); 
                } else {
                    alert("Gagal mengirim pesan.");
                }
            })
            .catch(error => console.error("Error:", error));
    }    

    function updateLikeDislike(id, type, increment) {
        fetch('../php/message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id, type, increment })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    alert("Gagal memperbarui " + type + ".");
                }
            })
            .catch(error => console.error("Error:", error));
    }

    function deleteMessage(id) {
        fetch('../php/message.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const messageItem = document.querySelector(`[data-id='${id}']`).closest('li');
                    messageItem.remove();
                } else {
                    alert("Gagal menghapus pesan: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
    }

    function displayMessage(id, message, likes, dislikes) {
        const li = document.createElement("li");
        li.setAttribute("data-id", id);
        li.innerHTML = `
            <span class="message-text">${message}</span>
            <div class="icon-container">
                <i class="fas fa-thumbs-up like-icon" data-id="${id}"></i>
                <i class="fas fa-thumbs-down dislike-icon" data-id="${id}"></i>
            </div>
            <div class="like-dislike-count">
                <span class="like-count">Suka: ${likes}</span> | 
                <span class="dislike-count">Tidak Suka: ${dislikes}</span>
            </div>
        `;

        li.querySelector(".like-icon").addEventListener("click", function () {
            const likeCountElement = li.querySelector(".like-count");
            let currentLikes = parseInt(likeCountElement.textContent.split(": ")[1]);

            if (this.classList.toggle("liked")) {
                currentLikes += 1;
                this.style.color = "green";
                updateLikeDislike(id, 'like', 1);
            } else {
                currentLikes -= 1;
                this.style.color = "";
                updateLikeDislike(id, 'like', -1);
            }

            likeCountElement.textContent = `Suka: ${currentLikes}`;
        });

        li.querySelector(".dislike-icon").addEventListener("click", function () {
            const dislikeCountElement = li.querySelector(".dislike-count");
            let currentDislikes = parseInt(dislikeCountElement.textContent.split(": ")[1]);

            if (this.classList.toggle("disliked")) {
                currentDislikes += 1;
                this.style.color = "red";
                updateLikeDislike(id, 'dislike', 1);
            } else {
                currentDislikes -= 1;
                this.style.color = "";
                updateLikeDislike(id, 'dislike', -1);
            }

            dislikeCountElement.textContent = `Tidak Suka: ${currentDislikes}`;
        });

        li.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
                deleteMessage(id);
            }
        });

        messageList.appendChild(li);
    }
});
