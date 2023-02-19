const toggleBtn = document.querySelector('.toggle');
const toggleIcon = document.querySelector('.toggle i');
const dropdown = document.querySelector('.dropdown_menu');

toggleBtn.onclick = function () {
    dropdown.classList.toggle('open');
    const isOpen = dropdown.classList.contains('open');

    toggleIcon.classList = isOpen ? 'bx bx-x-circle' : 'bx bx-menu';
}