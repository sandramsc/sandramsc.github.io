//designed by Sandra Ashipala https://github.com/sajustsmile 03/10/2021

const marble_menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar_menu');

//display mobile menu
const mobileMenu = () =>{
    marble_menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

marble_menu.addEventListener('click', mobileMenu);