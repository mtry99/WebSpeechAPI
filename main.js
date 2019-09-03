// Access speech synthesis
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];


function getVoices(){
    voices = synth.getVoices();

    // Loop through voices and create an option for each one
    voices.forEach(function(voice){
        // Create option element
        const option = document.createElement('option');
        // Fill option with voice and language
        option.textContent = voice.name + '('+ voice.lang +')';

        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });  
};

getVoices();
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

// Speak
function speak(){
    
    // Check if already speaking
    if(synth.speaking){
        console.error('Already speaking...');
        return;
    }
    if(textInput.value!= ''){    // If nothing is typed
        // Add background animation when speak function is activated
        body.style.background ='#141414 url(wave.gif)'; 
        body.style.backgroundRepeat = 'repeat-x';  // only on the x-axis
        body.style.backgroundSize = '100% 100%';

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // Speak end
        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';
        }

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');       
        }

        // Selected Voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // Loop through voices: if current iteration matches the voice that's selected than choose that voice
        voices.forEach(voice => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;       //speakText is the person speaking
            }
        });

        // Set pitch and rate 
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;
        // Speak
        synth.speak(speakText);
    }
};

// EVENT LISTENERS


// text form submit
textForm.addEventListener('submit', e =>{
    e.preventDefault();
    speak();
    textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));// call function to change rate value text

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak()); //call speak function when voice changes