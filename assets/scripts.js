
/* Created by maciejwolejszo.pl All rights reserved.  */

const selectElement = (s) => document.querySelector(s);

//Open The menu on click
selectElement('.open').addEventListener('click', () =>{
    selectElement('.nav-list').classList.add('active');
});

//Close The menu on click
selectElement('.close').addEventListener('click', () =>{
    selectElement('.nav-list').classList.remove('active');
});

//Gallery

const msnry = new Macy({
    container: '.gallery',
    mobileFirst: true,
    columns: 1,
    breakAt: {
      450: 2,
      700: 3,
      1100: 4,
    },
    margin: {
      x: 20,
      y: 20,
    }
  })
  window.addEventListener('scroll', function(){
    const header = document.querySelector('header');
    if(window.scrollY > 50){
        header.style.background = 'rgba(0,0,0,0.8)';
    } else {
        header.style.background = 'rgba(0,0,0,0.5)';
    }
});