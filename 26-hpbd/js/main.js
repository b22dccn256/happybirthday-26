// ====== MAIN SCRIPT ======
let currentStage = 1;

// Music handling
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
window.isPlaying = false; // Expose to window for inline script

const playlist = [
    "music/hpbd.mp3",
    "music/as the leaves fall.mp3",
    "music/autumn coffee.mp3",
    "music/being yours is all i want.mp3",
    "music/cherry blossoms.mp3",
    "music/cozy nights with you.mp3",
    "music/hearing your voice makes me smile.mp3",
    "music/holding you.mp3",
    "music/i've been missing you.mp3",
    "music/inside your arms.mp3",
    "music/lazy together.mp3",
    "music/sakura forest.mp3",
    "music/sleepy.mp3",
    "music/smores.mp3",
    "music/so far away.mp3",
    "music/sunset.mp3",
    "music/we'll meet again.mp3"
];
let currentSongIndex = 0;

bgMusic.addEventListener('ended', function() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0; // Loop back to start
    }
    bgMusic.src = playlist[currentSongIndex];
    if (window.isPlaying) {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
    }
});

window.toggleMusic = function() {
    if (window.isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicToggle.classList.add('playing');
    }
    window.isPlaying = !window.isPlaying;
}

musicToggle.addEventListener('click', window.toggleMusic);

const container = document.getElementById('landing-page-container');

function inputToStage(stageIndex) {
    const offset = (stageIndex - 1) * 100;
    container.style.transform = `translateY(-${offset}vh)`;
    currentStage = stageIndex;
}

// Transition to Stage 2
document.getElementById('toStage2Btn').addEventListener('click', () => {
    inputToStage(2);
    
    // Init Audio Context for blowing out candles
    initMicrophoneForBlow();
});

// Candle blowing logic (Click and Mic Fallback)
const candles = document.querySelectorAll('.elegant-candle');
let extinguishedCount = 0;

function blowOutCandle(candle) {
    if (!candle.classList.contains('extinguished')) {
        candle.classList.add('extinguished');
        extinguishedCount++;
        
        if (extinguishedCount === candles.length) {
            celebrateBirthday();
        }
    }
}

// Click fallback
candles.forEach(candle => {
    candle.addEventListener('click', () => blowOutCandle(candle));
});

const btnMakeWish = document.getElementById('btnMakeWish');
if (btnMakeWish) {
    btnMakeWish.addEventListener('click', () => {
        candles.forEach(candle => blowOutCandle(candle));
    });
}

// Microphone logic using Web Audio API
async function initMicrophoneForBlow() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function detectBlow() {
            if (extinguishedCount >= candles.length) return; 
            
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            
            if (average > 80) {
                candles.forEach(candle => blowOutCandle(candle));
            }
            
            requestAnimationFrame(detectBlow);
        }
        
        detectBlow();
    } catch (err) {
        console.warn('Microphone access denied or not supported. Falling back to click only.', err);
    }
}

// Celebrate & Move to Stage 3
function celebrateBirthday() {
    document.getElementById('stage-2').classList.add('lights-on');
    const title = document.querySelector('.elegant-title');
    if (title) title.innerHTML = 'Tuổi 22 rực rỡ nhé! 💖';
    
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 1 },
            colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#03C160']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 1 },
            colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#03C160']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    
    setTimeout(() => {
        inputToStage(3);
    }, 3500);
}

// Stage 3 - Lightbox logic
const polaroids = document.querySelectorAll('.polaroid');
const lightbox = document.getElementById('lightbox');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeLightbox = document.querySelector('.close-lightbox');

polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', () => {
        const captionText = polaroid.querySelector('.caption').innerText;
        lightboxCaption.innerText = captionText;
        
        const photoBg = polaroid.querySelector('.photo').style.backgroundImage;
        document.querySelector('.lightbox-photo').style.backgroundImage = photoBg;
        
        lightbox.classList.add('active');
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});
