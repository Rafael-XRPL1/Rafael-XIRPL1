document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const goToRegisterLink = document.getElementById("goToRegister");
    const dashboardLink = "../html/dashboard.html";
    const adminLink = "../html/admin.html";
    const registerLink = document.getElementById("registerLink");
    const registeredDevice = sessionStorage.getItem("registeredDevice");
    const userRole = sessionStorage.getItem("userRole");
    const logoutButton = document.getElementById("logoutButton");

    function setupNavbar() {
        console.log("Role pengguna saat ini:", userRole);

        const adminNavbarElements = document.querySelectorAll(".admin-only");
        const userNavbarElements = document.querySelectorAll(".user-nav");

        if (userRole === "admin") {
            adminNavbarElements.forEach(element => {
                element.style.display = "block";
            });
            userNavbarElements.forEach(element => {
                element.style.display = "none";
            });
        } else if (userRole === "customer") {
            adminNavbarElements.forEach(element => {
                element.style.display = "none";
            });
            userNavbarElements.forEach(element => {
                element.style.display = "block";
            });
        }
    }

    function displayForm(state) {
        if (!loginForm || !registerForm) {
            console.error("Form login atau register tidak ditemukan.");
            return;
        }

        switch (state) {
            case "login":
                loginForm.style.display = "block";
                registerForm.style.display = "none";

                const loginHeader = document.createElement("h2");
                loginHeader.textContent = "Login";
                loginForm.prepend(loginHeader);
                break;
            case "register":
                loginForm.style.display = "none";
                registerForm.style.display = "block";
                registerLink.style.display = "none";

                const registerHeader = document.createElement("h2");
                registerHeader.textContent = "Register";
                registerForm.prepend(registerHeader);
                break;
            case "logout":
                alert("Anda telah logout. Silakan login kembali.");
                sessionStorage.clear();
                displayForm("login");
                break;
            default:
                console.error("State tidak valid:", state);
                displayForm("login");
        }
    }

    function handleRedirect() {
        const currentPath = window.location.pathname;

        if (registeredDevice) {
            if (!currentPath.includes("dashboard.html")) {
                window.location.href = dashboardLink;
            }
        } else {
            if (currentPath.includes("dashboard.html")) {
                alert("Anda harus login terlebih dahulu!");
                window.location.href = adminLink;
            } else {
                displayForm("login");
            }
        }
    }
    
    setupNavbar();
    handleRedirect();

    goToRegisterLink?.addEventListener("click", function (event) {
        event.preventDefault();
        displayForm("register");
    });

    registerForm?.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const role = document.getElementById("roleRegister").value;
        const telephone = registerForm.querySelector("input[name='telephone']").value;
        const username = registerForm.querySelector("input[name='username']").value;
        const email = registerForm.querySelector("input[name='email']").value;
        const password = registerForm.querySelector("input[name='password']").value;
    
        console.log({ role, telephone, username, email, password });

        if (role === "admin") {
            alert("Registrasi dengan role admin tidak diperbolehkan. Silakan login.");
            window.location.href = "../html/admin.html";
            return;                
        }
    
        fetch('../php/registrasi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, telephone, username, email, password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                sessionStorage.setItem("registeredDevice", email);
                sessionStorage.setItem("userRole", role);

                if (data.success) {
                    sessionStorage.setItem("registeredDevice", email);
                    sessionStorage.setItem("userRole", role);
                    alert("Registrasi berhasil! Silakan login.");
                    window.location.href = dashboardLink;
                } else {
                    alert("Registrasi gagal: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    });

    loginForm?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = loginForm.querySelector("input[name='email']").value;
        const password = loginForm.querySelector("input[name='password']").value;
        const role = document.getElementById("roleLogin").value;

        fetch(`../php/login_system.php?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`)
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem("registeredDevice", email);
                sessionStorage.setItem("userRole", role);

                if (data.success) {
                    alert("Login berhasil! Silakan login.");
    
                    if (role === "admin") {
                        window.location.href = "../html/dashboard.html"; 
                    } else if (role === "customer") {
                        window.location.href = "../html/dashboard.html"; 
                    } else {
                        window.location.href = dashboardLink;
                    }
                } else {
                    alert("Login gagal! Periksa email atau password.");
                }
            })
            .catch(error => console.error("Error:", error));
    });

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };

    logoutButton?.addEventListener("click", function () {
        sessionStorage.removeItem("registeredDevice");
        sessionStorage.removeItem("userRole");
        
        window.location.href = "../html/admin.html";
    });
});
