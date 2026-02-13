// ==================== CONFIGURATION ====================
const CONFIG = {
    PASSCODE: '022225', // Change this to your desired passcode
    VIDEOS: {
        INVITE: 'invite.mp4',  // Main invitation video
        YES: 'yes.mp4',         // "Yes" response video
        NO: 'no.mp4'            // "No" response video
    },
    TEXT: {
        SURPRISE_TITLE: 'Hi love…',
        SURPRISE_MESSAGE: "I know you think I don't have plans on inviting you on Valentine's Day.",
        SURPRISE_HINT: 'Tap anywhere for magic ✨'
    }
};

// ==================== STATE MANAGEMENT ====================
let currentPasscode = '';
let surpriseClicks = 0;

// ==================== DOM ELEMENTS ====================
const screens = {
    lock: document.getElementById('lockScreen'),
    surprise: document.getElementById('surpriseScreen'),
    invite: document.getElementById('inviteScreen'),
    yes: document.getElementById('yesScreen'),
    no: document.getElementById('noScreen')
};

const videos = {
    invite: document.getElementById('inviteVideo'),
    yes: document.getElementById('yesVideo'),
    no: document.getElementById('noVideo')
};

const elements = {
    dots: document.querySelectorAll('.passcode-dots .dot'),
    errorMessage: document.querySelector('.error-message'),
    lockContainer: document.querySelector('.lock-container'),
    heartContainer: document.getElementById('heartContainer'),
    magicBtn: document.getElementById('magicBtn'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    restartBtn: document.getElementById('restartBtn')
};

// ==================== INITIALIZATION ====================
function init() {
    setupKeypad();
    setupKeyboardSupport();
    setupSurpriseInteractions();
    setupVideoHandlers();
    setupChoiceButtons();
    setupRestartButton();
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.remove('hidden');
        screens[screenName].classList.add('active');
    }

    // Pause all videos when switching screens
    pauseAllVideos();
}

function pauseAllVideos() {
    Object.values(videos).forEach(video => {
        if (video && !video.paused) {
            video.pause();
            video.currentTime = 0;
        }
    });
}

// ==================== LOCK SCREEN LOGIC ====================
function setupKeypad() {
    const keyButtons = document.querySelectorAll('.key-btn');
    
    keyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.key;
            const action = button.dataset.action;

            if (action === 'clear') {
                clearPasscode();
            } else if (action === 'delete') {
                deleteLastDigit();
            } else if (key) {
                addDigit(key);
            }
        });
    });
}

function setupKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard input on lock screen
        if (!screens.lock.classList.contains('active')) return;

        if (e.key >= '0' && e.key <= '9') {
            addDigit(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            deleteLastDigit();
        } else if (e.key === 'Escape') {
            clearPasscode();
        } else if (e.key === 'Enter') {
            checkPasscode();
        }
    });
}

function addDigit(digit) {
    if (currentPasscode.length < 6) {
        currentPasscode += digit;
        updateDots();

        if (currentPasscode.length === 6) {
            checkPasscode();
        }
    }
}

function deleteLastDigit() {
    if (currentPasscode.length > 0) {
        currentPasscode = currentPasscode.slice(0, -1);
        updateDots();
    }
}

function clearPasscode() {
    currentPasscode = '';
    updateDots();
    hideError();
}

function updateDots() {
    elements.dots.forEach((dot, index) => {
        if (index < currentPasscode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function checkPasscode() {
    if (currentPasscode === CONFIG.PASSCODE) {
        handleCorrectPasscode();
    } else {
        handleIncorrectPasscode();
    }
}

function handleCorrectPasscode() {
    // Success animation
    elements.lockContainer.style.animation = 'glassGlow 0.5s ease';
    
    setTimeout(() => {
        showScreen('surprise');
    }, 500);
}

function handleIncorrectPasscode() {
    // Shake animation
    elements.lockContainer.classList.add('shake');
    showError();

    setTimeout(() => {
        elements.lockContainer.classList.remove('shake');
        clearPasscode();
    }, 500);
}

function showError() {
    elements.errorMessage.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 2000);
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

// ==================== SURPRISE SCREEN LOGIC ====================
function setupSurpriseInteractions() {
    // Create hearts on click anywhere on surprise screen
    screens.surprise.addEventListener('click', (e) => {
        if (e.target !== elements.magicBtn) {
            createFloatingHeart(e.clientX, e.clientY);
            surpriseClicks++;
        }
    });

    // Magic button to proceed to invitation
    elements.magicBtn.addEventListener('click', () => {
        showScreen('invite');
        playVideo(videos.invite);
    });
}

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '♡';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    elements.heartContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// ==================== VIDEO HANDLING ====================
function setupVideoHandlers() {
    // Yes video: show restart button when ended
    videos.yes.addEventListener('ended', () => {
        elements.restartBtn.classList.remove('hidden');
    });

    // No video: auto return to invite screen when ended
    videos.no.addEventListener('ended', () => {
        setTimeout(() => {
            showScreen('invite');
            playVideo(videos.invite);
        }, 500);
    });
}

function playVideo(video) {
    if (video) {
        video.currentTime = 0;
        video.muted = false;
        video.play().catch(err => {
            console.log('Video autoplay prevented:', err);
            // If autoplay is blocked, user can click video to play
        });
    }
}

// ==================== CHOICE BUTTONS ====================
function setupChoiceButtons() {
    elements.yesBtn.addEventListener('click', () => {
        showScreen('yes');
        playVideo(videos.yes);
    });

    elements.noBtn.addEventListener('click', () => {
        showScreen('no');
        playVideo(videos.no);
    });
}

// ==================== RESTART BUTTON ====================
function setupRestartButton() {
    elements.restartBtn.addEventListener('click', () => {
        resetApp();
    });
}

function resetApp() {
    // Reset state
    currentPasscode = '';
    surpriseClicks = 0;
    
    // Reset UI
    updateDots();
    hideError();
    elements.restartBtn.classList.add('hidden');
    
    // Pause and reset all videos
    pauseAllVideos();
    
    // Return to lock screen
    showScreen('lock');
}

// ==================== START APPLICATION ====================
document.addEventListener('DOMContentLoaded', init);
