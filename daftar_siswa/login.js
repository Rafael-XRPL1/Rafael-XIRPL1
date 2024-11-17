const updateTime = () => {
  let date = new Date(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
};
const mounted = () => {
  let tanggalElement = document.getElementById('tanggal');
  let tanggalSekarang = new Date();
  let tanggalString =
    tanggalSekarang.getDate() + ' ' +
    ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][tanggalSekarang.getMonth()] + ' ' +
    tanggalSekarang.getFullYear();
  tanggalElement.innerText = tanggalString;

  setInterval(updateTime, 1000); 
};
document.addEventListener('DOMContentLoaded', mounted);



document.addEventListener('DOMContentLoaded', function() {
  const tombol = document.getElementById('tombol');
  const loading = document.querySelector('.loading');

  tombol.addEventListener('click', function() {
    console.log('Pengiriman Data');
      loading.style.display = 'block';

      setTimeout(function() {
          loading.style.display = 'none';
      }, 5000);
  });
  const btnCancel = document.getElementById('btnCancel');
    btnCancel.addEventListener('click', function() {
        console.log('Reset Data');
    });
});




document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('uploadInput');
  const imageContainer = document.getElementById('imageContainer');

  uploadInput.addEventListener('change', function() {
      const files = this.files; 

      for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.type.startsWith('image/')) {
              console.log('Memasukan Gambar')
          } else {
              console.log(`File '${file.name}' bukan gambar dan akan dilewati.`);
          }
      }
  });
});