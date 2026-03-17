
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
// podstawowy URL RoomAdmin
const baseRoomAdminUrl = 'https://roomadmin.pl/widget/reservation-v2/start?fh=10593f2b1434dc58d459b5eb6102eb5823eda43e&style=%7B%22color_accent%22%3A%22%23A1195B%22%2C%22color_bg%22%3A%22%23FFFFFF%22%7D';

let currentLang = 'pl'; // domyślny język

// funkcja aktualizacji iframe
function updateRoomAdminIframe(lang) {
    const iframe = document.getElementById('ra-reservation-form-v2');
    if(!iframe) return;

    // zmiana src tylko jeśli język się zmienił
    if(iframe.dataset.lang !== lang){
        iframe.src = `${baseRoomAdminUrl}&lang=${lang}`;
        iframe.dataset.lang = lang; // zapamiętaj aktualny język
    }
}

// polling języka GTranslate co 500ms
setInterval(() => {
    const gtSelect = document.querySelector('.gtranslate_wrapper select'); // standardowy select w widgetach GTranslate
    if(gtSelect){
        const lang = gtSelect.value; // np. 'pl', 'en', 'de'
        if(lang !== currentLang){
            currentLang = lang;
            updateRoomAdminIframe(lang);
        }
    }
}, 500);

// inicjalizacja na starcie
updateRoomAdminIframe(currentLang);