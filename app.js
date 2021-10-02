//designed by Sandra Ashipala https://github.com/sajustsmile for 03/10/2021

const marble_menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');
const navLogo = document.querySelector('#navbar_logo');

//display mobile menu
const mobileMenu = () =>{
    marble_menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

marble_menu.addEventListener('click', mobileMenu);

//show active menu when scrolling
const highlightMenu = () =>{
    const space = document.querySelector('.highlight');
    const homeMenu = document.querySelector('#home-page');
    const storyMenu = document.querySelector('#story-page');
    const orbitMenu = document.querySelector('#orbit-page');
    const teamMenu = document.querySelector('#team-page');
    //shows were the scroll is located
    let scrollPos = window.scrollY

    // adds 'highlight' class to menu items
    //highlight class stops to function at 960px
    if (window.innerWidth > 960 && scrollPos < 600){
        homeMenu.classList.add('highlight');
        storyMenu.classList.remove('highlight');
        return;
    }else if (window.innerWidth > 960 && scrollPos < 1400){
        storyMenu.classList.add('highlight');
        homeMenu.classList.remove('highlight');
        orbitMenu.classList.remove('highlight');
        teamMenu.classList.remove('highlight');
        return;
    }else if (window.innerWidth > 960 && scrollPos < 2345){
    orbitMenu.classList.add('highlight');
    storyMenu.classList.remove('highlight');
    teamMenu.classList.remove('highlight');
    
    return;
}else if (window.innerWidth > 960 && scrollPos < 4145){
    teamMenu.classList.add('highlight');
    storyMenu.classList.remove('highlight');
    orbitMenu.classList.remove('highlight');
    return
}
if ((space && window.innerWidth < 960 && scrollPos < 600) || space){
   space.classList.remove('highlight')
    return
}
}




window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

//closes momile menu whenhovering over menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active')
    if(window.innerWidth <= 768 && menuBars){
        menuBars.classList.toggle('is-active')
        menuLinks.classList.remove('active')
    }
}

//triggers the above for menuLnks
menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);