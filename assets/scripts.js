
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

//<-----YANOSIK ChatBot----------->
// inicjalizacja na starcie
updateRoomAdminIframe(currentLang);

window.addEventListener('load', () => {

    const widget = document.getElementById('yanosik-widget');
    const closeBtn = document.getElementById('yanosik-close');
    const sendBtn = document.getElementById('yanosik-send');
    const input = document.getElementById('yanosik-input');
    const messages = document.getElementById('yanosik-messages');

    if(!widget) return;

    const supportedLangs = ["pl","en","de","it","es","fr","hu"];
    let currentLang = 'pl';

    // --- otwarcie widgetu po 1s ---
    setTimeout(()=>{ widget.classList.add('open'); }, 1000);

    function addMessage(text, sender='user'){
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.margin = '0.5rem 0';
        msg.style.padding = '0.5rem';
        msg.style.borderRadius = '0.5rem';
        msg.style.whiteSpace = 'pre-line';
        msg.style.background = sender==='user' ? '#A1195B' : '#eee';
        msg.style.color = sender==='user' ? '#fff' : '#000';
        msg.style.alignSelf = sender==='user' ? 'flex-end' : 'flex-start';
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }
// --- Powitanie YANOSIK-a przy otwarciu ---
setTimeout(()=>{
    addMessage("Cześć! Jestem YANOSIK. \n\nNa ten moment jeszcze trwają pracę nad moimi możliwościami. Już nie długo będę mógł Ci pomóc i odpowiedzieć na twoje pytania. \n\nPóki co proszę skorzystaj z formularza kontaktowego na dole strony. \n\nDziękuję.", 'bot');
}, 1500);
    closeBtn.addEventListener('click', ()=>{
        widget.classList.remove('open');
    });

    function getCurrentLang(){
        const gtSelect = document.querySelector('.gtranslate_wrapper select');
        if(gtSelect && supportedLangs.includes(gtSelect.value)) return gtSelect.value;
        return 'pl';
    }

    sendBtn.addEventListener('click', ()=>{
        const text = input.value.trim();
        if(!text) return;

        currentLang = getCurrentLang();
        addMessage(text, 'user');

        console.log(`Wiadomość użytkownika (${currentLang}):`, text);

        setTimeout(()=>{
            const replyTexts = {
                'pl':'Dziękujemy za wiadomość. Wkrótce odpowiemy.',
                'en':'Thank you for your message. We will respond soon.',
                'de':'Vielen Dank für Ihre Nachricht. Wir werden uns bald melden.',
                'it':'Grazie per il messaggio. Risponderemo presto.',
                'es':'Gracias por su mensaje. Responderemos pronto.',
                'fr':'Merci pour votre message. Nous répondrons bientôt.',
                'hu':'Köszönjük az üzenetet. Hamarosan válaszolunk.'
            };
            addMessage(replyTexts[currentLang] || replyTexts['pl'], 'bot');
        }, 700);

        input.value='';
    });

    setInterval(()=>{ currentLang = getCurrentLang(); }, 500);

});