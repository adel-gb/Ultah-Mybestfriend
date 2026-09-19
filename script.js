// =========================
// BIRTHDAY PERSON
// =========================
const birthdayName = "Zhifaa";

/* =========================
   AUDIO SYSTEM
========================= */
const AUDIO = {
    bgm: null,
    camera: null,
    pop: null,
    envelope: null,
    whoosh: null,
    confetti: null,
    gift: null,
    bgmMuted: false,   // ← khusus BGM
    started: false,
};

function initAudio() {
    AUDIO.bgm = document.getElementById("bgm");
    AUDIO.camera = document.getElementById("sfx-camera");
    AUDIO.pop = document.getElementById("sfx-pop");
    AUDIO.envelope = document.getElementById("sfx-envelope");
    AUDIO.whoosh = document.getElementById("sfx-whoosh");
    AUDIO.confetti = document.getElementById("sfx-confetti");
    AUDIO.gift = document.getElementById("sfx-gift");

    // Debug: cek elemen mana yang ketemu
    console.log("=== AUDIO INIT ===");
    console.log("bgm:", AUDIO.bgm);
    console.log("camera:", AUDIO.camera);
    console.log("pop:", AUDIO.pop);
    console.log("envelope:", AUDIO.envelope);
    console.log("whoosh:", AUDIO.whoosh);
    console.log("confetti:", AUDIO.confetti);
    console.log("gift:", AUDIO.gift);

    if (AUDIO.bgm) AUDIO.bgm.volume = 0.35;
    if (AUDIO.camera) AUDIO.camera.volume = 0.6;
    if (AUDIO.pop) AUDIO.pop.volume = 0.5;
    if (AUDIO.envelope) AUDIO.envelope.volume = 0.6;
    if (AUDIO.whoosh) AUDIO.whoosh.volume = 0.7;
    if (AUDIO.confetti) AUDIO.confetti.volume = 0.5;
    if (AUDIO.gift) AUDIO.gift.volume = 0.5;
}

function playSFX(name) {
    const sound = AUDIO[name];
    if (!sound) {
        console.warn("SFX gak ketemu:", name);
        return;
    }
    try {
        sound.currentTime = 0;
        sound.volume = 0.6;
        const p = sound.play();
        if (p) p.catch(err => console.log("SFX error [" + name + "]:", err));
    } catch (e) {
        console.log("SFX exception [" + name + "]:", e);
    }
}

function startBGM() {
    if (!AUDIO.bgm || AUDIO.started) return;
    AUDIO.started = true;
    AUDIO.bgm.volume = 0;
    AUDIO.bgm.play().then(() => {
        let vol = 0;
        const target = 0.35;
        const fade = setInterval(() => {
            vol += 0.02;
            if (vol >= target) {
                vol = target;
                clearInterval(fade);
            }
            AUDIO.bgm.volume = vol;
        }, 60);
        updateMusicIcon(true);
    }).catch(err => {
        console.log("BGM gagal:", err);
        AUDIO.started = false;
    });
}

function toggleMusic() {
    if (!AUDIO.bgm) return;
    // Toggle HANYA BGM, bukan SFX
    if (AUDIO.bgm.paused) {
        AUDIO.bgmMuted = false;
        if (!AUDIO.started) startBGM();
        else AUDIO.bgm.play().catch(() => {});
        updateMusicIcon(true);
    } else {
        AUDIO.bgmMuted = true;
        AUDIO.bgm.pause();
        updateMusicIcon(false);
    }
}

function updateMusicIcon(playing) {
    const icon = document.getElementById("music-icon");
    const btn = document.getElementById("music-toggle");
    if (!icon) return;
    icon.textContent = playing ? "🔊" : "🔇";
    if (btn) btn.classList.toggle("playing", playing);
}

// Init audio setelah DOM ready
document.addEventListener("DOMContentLoaded", initAudio);

// Fallback kalau DOMContentLoaded udah lewat
if (document.readyState === "complete" || document.readyState === "interactive") {
    initAudio();
}

// Autoplay BGM saat interaksi pertama
function armAutoplayBGM() {
    const start = () => {
        startBGM();
        document.removeEventListener("click", start);
        document.removeEventListener("touchstart", start);
    };
    document.addEventListener("click", start);
    document.addEventListener("touchstart", start);
}
armAutoplayBGM();

//=========================
// NAME
//=========================
function setLetterName() {
    const letterName = document.getElementById("letter-name");
    if (letterName) letterName.innerHTML = birthdayName;
}

/* =========================
   PAGE NAVIGATION
========================= */
function nextPage(pageId) {
    const currentPage = document.querySelector(".page.active");
    const nextPage = document.getElementById(pageId);
    if (!currentPage || !nextPage) return;
    currentPage.classList.remove("active");
    setTimeout(() => {
        nextPage.classList.add("active");
        if (pageId === "birthday") startBirthdayTyping();
        if (pageId === "letter") setLetterName();
    }, 100);
}

/* =========================
   OPEN SURPRISE
========================= */
function openSurprise() {
    playSFX("pop");
    nextPage("envelope");
}

/* =========================
   OPEN LETTER
========================= */
function openLetter() {
    const envelope = document.querySelector(".envelope");
    if (!envelope) return;
    envelope.classList.add("opened");
    playSFX("envelope");
    createConfetti();
    setTimeout(() => nextPage("birthday"), 1400);
}

/* =========================
   CANDLE
========================= */
function blowCandle() {
    const flame = document.getElementById("flame");
    const wishText = document.getElementById("wish-text");
    const nextButton = document.getElementById("cake-next");
    if (!flame || flame.classList.contains("off")) return;

    flame.classList.add("off");
    playSFX("whoosh");
    if (wishText) {
        wishText.innerHTML = "Your wish has been sent to the universe... ✨💗";
    }
    createConfetti();
    setTimeout(() => {
        if (nextButton) nextButton.classList.remove("hidden");
    }, 1200);
}

/* =========================
   GIFT
========================= */
function openGift() {
    const gift = document.getElementById("gift-box");
    const hint = document.getElementById("gift-hint");
    const finalMessage = document.getElementById("final-message");
    if (!gift) return;

    gift.classList.add("opened");
    if (hint) hint.style.opacity = "0";
    playSFX("gift");

    setTimeout(() => {
        playSFX("confetti");
        createConfetti();
    }, 400);

    setTimeout(() => {
        if (finalMessage) finalMessage.classList.add("show");
    }, 900);
}

/* =========================
   CONFETTI
========================= */
function createConfetti() {
    const items = ["💗", "💕", "🎀", "✨", "🌸"];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.innerHTML = items[Math.floor(Math.random() * items.length)];
        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-30px";
        confetti.style.fontSize = Math.random() * 15 + 10 + "px";
        confetti.style.zIndex = "999";
        confetti.style.pointerEvents = "none";
        document.body.appendChild(confetti);
        const duration = Math.random() * 3 + 2;
        confetti.animate(
            [
                { transform: "translateY(0) rotate(0deg)", opacity: 1 },
                { transform: "translateY(110vh) rotate(720deg)", opacity: 0 }
            ],
            { duration: duration * 1000, easing: "ease-in" }
        );
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

/* =========================
   FLOATING HEARTS
========================= */
function createFloatingDecoration() {
    const decorations = ["♡", "♥", "💗", "💕", "🎀", "🌸"];
    const item = document.createElement("div");
    item.classList.add("floating-decoration");
    item.innerHTML = decorations[Math.floor(Math.random() * decorations.length)];
    item.style.left = Math.random() * 100 + "vw";
    item.style.fontSize = Math.random() * 15 + 15 + "px";
    item.style.animationDuration = Math.random() * 5 + 6 + "s";
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 12000);
}

/* =========================
   SPARKLES
========================= */
function createSparkle() {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle-decoration");
    sparkle.innerHTML = "✦";
    sparkle.style.left = Math.random() * 95 + "vw";
    sparkle.style.top = Math.random() * 90 + "vh";
    sparkle.style.fontSize = Math.random() * 10 + 10 + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4000);
}

/* =========================
   START DECORATIONS
========================= */
const isMobile = window.innerWidth < 600;
let floatingCount = 0;
const MAX_FLOATING = isMobile ? 6 : 12;

setInterval(() => {
    if (document.hidden) return;
    if (floatingCount >= MAX_FLOATING) return;
    createFloatingDecoration();
    floatingCount++;
    setTimeout(() => floatingCount--, 12000);
}, isMobile ? 1500 : 900);

setInterval(() => {
    if (document.hidden) return;
    const sparkles = document.querySelectorAll(".sparkle-decoration");
    if (sparkles.length >= 15) return;
    createSparkle();
}, isMobile ? 1800 : 1200);

/* =========================
   TYPING EFFECT
========================= */
function startBirthdayTyping() {
    const textElement = document.getElementById("typing-text");
    const content = document.getElementById("birthday-content");
    if (!textElement || !content) return;

    const text = `Happy Birthday, ${birthdayName}! 🎀`;
    let index = 0;
    textElement.innerHTML = "";
    content.classList.remove("show");

    const typing = setInterval(() => {
        textElement.innerHTML += text.charAt(index);
        index++;
        if (index >= text.length) {
            clearInterval(typing);
            setTimeout(() => content.classList.add("show"), 500);
        }
    }, 80);
}

// =========================
// PHOTO POPUP
// =========================
function openPhoto(imageSrc, caption) {
    const popup = document.getElementById("photo-popup");
    const image = document.getElementById("popup-image");
    const captionText = document.getElementById("popup-caption");
    if (!popup || !image) return;

    playSFX("camera");
    image.src = imageSrc;
    if (captionText) captionText.innerHTML = caption;
    popup.classList.add("show");
}
function closePhoto() {
    const popup = document.getElementById("photo-popup");
    if (popup) popup.classList.remove("show");
}

// =========================
// REPLAY WEBSITE
// =========================
function replayWebsite() {
    const activePage = document.querySelector(".page.active");
    if (activePage) activePage.classList.remove("active");
    const opening = document.getElementById("opening");
    if (opening) opening.classList.add("active");

    const gift = document.getElementById("gift-box");
    const hint = document.getElementById("gift-hint");
    const finalMessage = document.getElementById("final-message");
    if (gift) gift.classList.remove("opened");
    if (hint) hint.style.opacity = "1";
    if (finalMessage) finalMessage.classList.remove("show");

    const flame = document.getElementById("flame");
    const wishText = document.getElementById("wish-text");
    const cakeNext = document.getElementById("cake-next");
    if (flame) flame.classList.remove("off");
    if (wishText) wishText.innerHTML = "Tap the candle to make a wish! 🕯️";
    if (cakeNext) cakeNext.classList.add("hidden");

    const envelope = document.querySelector(".envelope");
    if (envelope) envelope.classList.remove("opened");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   GLOBAL BUTTON SFX
========================= */
document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.id === "music-toggle") return;
    playSFX("pop");
});

/* =========================
   CUTE CAT COMPANION
========================= */
const CAT_MESSAGES = [
    { text: "hi kamu! 🐱", face: "🐱" },
    { text: "selamat ulang tahun ya~ 🎂", face: "😸" },
    { text: "semoga harimu se-cute kamu hari ini ♡", face: "😻" },
    { text: "jangan lupa makan ya! 🍰", face: "😺" },
    { text: "kamu cantik banget tau hari ini ✨", face: "😻" },
    { text: "meow~ 🐾", face: "🐱" },
    { text: "aku titip salam dari Adell loh 💌", face: "😽" },
    { text: "smile dong, aku suka liat kamu senyum 😸", face: "😸" },
    { text: "semoga semua mimpimu tercapai ya 🌟", face: "😺" },
    { text: "jangan lupa minum air putih 💧", face: "🐱" },
    { text: "kamu keren udah bertahan sampai hari ini! 💪", face: "😼" },
    { text: "aku follow kamu dari awal tau 🐾", face: "🐈" },
    { text: "meow meow~ aku suka kamu ♡", face: "😻" },
    { text: "have a purr-fect day! 🐱💗", face: "😸" },
    { text: "sehat terus ya, jangan sakit-sakitan 🩹", face: "😺" },
    { text: "kamu berharga banget, inget itu ya 💗", face: "😽" },
    { text: "titip peluk virtual buat kamu 🤗", face: "😽" },
    { text: "jangan lupa istirahat ya, jangan begadang 🌙", face: "😿" },
    { text: "kamu tuh kayak matahari, bikin hangat ☀️", face: "😻" },
    { text: "aku bukan kucing biasa, aku kucing yang sayang kamu 🐱💕", face: "😻" },
];

const CAT_FACES = [
    "🐱",  // kucing biasa (wajah default)
    "😺",  // kucing senyum
    "😸",  // kucing ketawa
    "😻",  // kucing suka banget (mata hati)
    "😽",  // kucing cium
    "🐈",  // kucing gede (badan)
    "😼",  // kucing nyengir
    "🐈‍⬛",  // kucing hitam
    "🙀",  // kucing kaget
    "😿",  // kucing sedih
];

let catIndex = 0;
let catTimer = null;
let catHideTimer = null;
let catVisible = false;

function shuffleCatMessages() {
    // Shuffle biar urutannya gak monoton
    for (let i = CAT_MESSAGES.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [CAT_MESSAGES[i], CAT_MESSAGES[j]] = [CAT_MESSAGES[j], CAT_MESSAGES[i]];
    }
}
shuffleCatMessages();

function showCat() {
    const cat = document.getElementById("cat-companion");
    const text = document.getElementById("cat-text");
    const emoji = document.getElementById("cat-emoji");
    if (!cat || catVisible) return;

    const msg = CAT_MESSAGES[catIndex];
    text.textContent = msg.text;
    if (emoji) {
        emoji.textContent = msg.face;   // ← muka sesuai pesan
        emoji.style.transform = "scale(0.6) rotate(-15deg)";
        setTimeout(() => { emoji.style.transform = ""; }, 250);
    }
    catIndex = (catIndex + 1) % CAT_MESSAGES.length;

    cat.classList.remove("hidden");
    cat.classList.add("show");
    catVisible = true;

    const hideDelay = 6000 + Math.random() * 2000;
    catHideTimer = setTimeout(hideCat, hideDelay);
}

function hideCat() {
    const cat = document.getElementById("cat-companion");
    if (!cat) return;
    cat.classList.remove("show");
    cat.classList.add("hidden");
    catVisible = false;
}

function catSpeakNext() {
    const bubble = document.getElementById("cat-bubble");
    const text = document.getElementById("cat-text");
    const cat = document.getElementById("cat-companion");
    const emoji = document.getElementById("cat-emoji");
    if (!bubble || !text) return;

    bubble.classList.add("changing");
    spawnCatHearts(cat);
    if (typeof playSFX === "function") playSFX("pop");

    setTimeout(() => {
        const msg = CAT_MESSAGES[catIndex];
        text.textContent = msg.text;
        if (emoji) {
            emoji.textContent = msg.face;
            emoji.style.transform = "scale(1.3) rotate(10deg)";
            setTimeout(() => { emoji.style.transform = ""; }, 300);
        }
        catIndex = (catIndex + 1) % CAT_MESSAGES.length;
        bubble.classList.remove("changing");
    }, 250);

        clearTimeout(catHideTimer);
        catHideTimer = setTimeout(() => {
            hideCat();
        }, 6000);
}

function spawnCatHearts(cat) {
    if (!cat) return;
    const rect = cat.getBoundingClientRect();
    const hearts = ["💗", "♡", "💕", "✨", "🐾"];
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement("div");
        heart.className = "cat-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + "px";
        heart.style.top = (rect.top + 10) + "px";
        heart.style.animationDelay = (i * 0.1) + "s";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1800);
    }
}

// Loop munculin kucing random
function scheduleCat() {
    // Muncul tiap 8-15 detik
    const delay = 8000 + Math.random() * 7000;
    catTimer = setTimeout(() => {
        if (!document.hidden) showCat();
        scheduleCat();
    }, delay);
}

// Pause kalau tab gak aktif
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearTimeout(catTimer);
        clearTimeout(catHideTimer);
    } else {
        scheduleCat();
    }
});

// Start
scheduleCat();

// Munculin sekali di awal biar user tau ada kucing
window.addEventListener("load", () => {
    setTimeout(showCat, 2500);
});