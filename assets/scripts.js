
/* Created by maciejwolejszo.pl All rights reserved.  */

const selectElement = (s) => document.querySelector(s);
emailjs.init("0tEZFrnptUaNPU774");
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

window.addEventListener('load', () => {
    const widget = document.getElementById('yanosik-widget');
    const closeBtn = document.getElementById('yanosik-close');
    const sendBtn = document.getElementById('yanosik-send');
    const input = document.getElementById('yanosik-input');
    const messages = document.getElementById('yanosik-messages');

    if(!widget) return;
    // obsługiwane języki
    const supportedLangs = ["pl","en","de","it","es","fr","hu"];
    let currentLang = 'pl';
    // etapy rozmowy
    let chatStep = 1;
    let userMessage = '';
    let userName = '';
    let userEmail = '';

    // automatyczne otwarcie widgetu
    setTimeout(() => {
        widget.classList.add('open');
    }, 1200);

    // pobieranie aktualnego języka GTranslate
    function getCurrentLang(){
        const gtSelect =
            document.querySelector('.gtranslate_wrapper select');
        if(gtSelect && supportedLangs.includes(gtSelect.value)){
            return gtSelect.value;
        }
        return 'pl';
    }

    // wymuszenie odświeżenia tłumaczeń GTranslate
    function refreshTranslations(){
        try{
            const gtSelect =
                document.querySelector('.gtranslate_wrapper select');
            if(gtSelect){
                const lang = gtSelect.value;
                if(window.doGTranslate){
                    window.doGTranslate(lang);
                }
            }
        } catch(e){
            console.log(e);
        }
    }
    // dodawanie wiadomości
    function addMessage(text, sender='user'){
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.margin = '0.5rem 0';
        msg.style.padding = '0.7rem';
        msg.style.borderRadius = '0.8rem';
        msg.style.whiteSpace = 'pre-line';
        msg.style.maxWidth = '85%';
        msg.style.wordWrap = 'break-word';
        msg.style.fontSize = '0.92rem';
        msg.style.background =
            sender === 'user'
            ? '#A1195B'
            : '#f1f1f1';
        msg.style.color =
            sender === 'user'
            ? '#fff'
            : '#000';
        msg.style.alignSelf =
            sender === 'user'
            ? 'flex-end'
            : 'flex-start';
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        refreshTranslations();
    }
    // powitanie
    setTimeout(() => {
        addMessage(
`Cześć! Jestem YANOSIK.
\n\nNa ten moment jeszcze trwają prace nad moimi możliwościami. \n\nNie mogę odpowiadać jeszcze na twoje pytania.
Za to mogę przekazać twoje pytania do obsługi obiektu.\n\n
W czym mogę pomóc?`,
        'bot');

    }, 1800);

    // zamknięcie widgetu
    closeBtn.addEventListener('click', () => {
        widget.classList.remove('open');
    });

    // ENTER = wyślij
    input.addEventListener('keypress', function(e){

        if(e.key === 'Enter'){
            sendBtn.click();
        }

    });

    // wysyłanie wiadomości
    sendBtn.addEventListener('click', () => {

        const text = input.value.trim();

        if(!text) return;

        currentLang = getCurrentLang();

        addMessage(text, 'user');

        // STEP 1 -> pytanie użytkownika
        if(chatStep === 1){

            userMessage = text;

            setTimeout(() => {

                addMessage(
                    'Proszę podaj swoje imię.',
                    'bot'
                );

            }, 700);

            chatStep = 2;

            input.value = '';

            return;
        }

        // STEP 2 -> imię
        if(chatStep === 2){

            userName = text;

            setTimeout(() => {

                addMessage(
                    'Proszę podaj swój adres e-mail.',
                    'bot'
                );

            }, 700);

            chatStep = 3;

            input.value = '';

            return;
        }

        // STEP 3 -> email + wysyłka
        if(chatStep === 3){

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // błędny email
            if(!emailRegex.test(text)){

                addMessage(
                    'Proszę podać poprawny adres e-mail.',
                    'bot'
                );

                return;
            }

            userEmail = text;

            // loader
            const typing = document.createElement('div');

            typing.textContent = 'YANOSIK pisze...';

            typing.style.fontSize = '0.8rem';
            typing.style.opacity = '0.7';
            typing.style.margin = '0.5rem';

            messages.appendChild(typing);

            messages.scrollTop = messages.scrollHeight;

            refreshTranslations();

            // EMAILJS SEND
            emailjs.send(

                "service_vzoajel",
                "template_6idf45h",

                {
                    name: userName,
                    email: userEmail,
                    message: userMessage,
                    lang: currentLang,
                    time: new Date().toLocaleString()
                }

            ).then(function(response){

                console.log("YANOSIK MAIL OK", response);

            }).catch(function(error){

                console.error("YANOSIK MAIL ERROR", error);

            });

            // odpowiedź końcowa
            setTimeout(() => {

                typing.remove();

                addMessage(
`Dziękujemy za wiadomość.

Obsługa obiektu otrzymała Twoje zgłoszenie i odpowie na podany adres mailowy możliwie najszybciej.`,
                'bot');

            }, 1400);

            // reset rozmowy
            chatStep = 1;

            userMessage = '';
            userName = '';
            userEmail = '';

            input.value = '';
        }

    });

    // aktualizacja języka
    setInterval(() => {

        currentLang = getCurrentLang();

    }, 500);

});