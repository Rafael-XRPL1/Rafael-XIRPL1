document.addEventListener("DOMContentLoaded", function () {
    const text = "Selamat Datang, Dan Selamat Memesan";
    let index = 0;

    function typeEffect() {
        if (index < text.length) {
            document.getElementById("typing-text").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeEffect, 100); 
        } else {
            setTimeout(eraserEffect, 2000);
        }
    }

    function eraserEffect() {
        if (index > 0) {
            document.getElementById("typing-text").innerHTML = text.substring(0, index - 1);
            index--;
            setTimeout(eraserEffect, 50);
        } else {
            setTimeout(typeEffect, 500);
        }
    }

    typeEffect();
});
