let imgBox = document.getElementById("qrImageBox");
let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");

//функція для генерація QR коду з тексту чи лінка
//перевіряє чи не пусте поле, якщо воно пусте - то добавляєм клас error який трясе поле вводу
//клас error ініціалізує анімацію тряски, що використовувати її повторно, вона додана в таймер 
function generateQR() {
    if (qrText.value.length > 0) {
        qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + qrText.value;
        imgBox.classList.add("show-img");
    } else {
        qrText.classList.add("error");
        setTimeout(() => {
            qrText.classList.remove("error");
        }, 1000);

    }
}