
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = toggleBtn.querySelector('i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.addEventListener('click', function () {
dropDownMenu.classList.toggle('open');
const isOpen = dropDownMenu.classList.contains('open');

toggleBtnIcon.className = isOpen ? 'fa fa-xmark' : 'fa fa-bars';
});