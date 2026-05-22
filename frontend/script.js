/**
 * ADHD Educational App - Frontend Script
 * Main application logic with API communication
 * 
 * Features:
 * - Game state management
 * - API communication with backend
 * - Web Speech API for accessibility
 * - Visual and audio feedback system
 * - Progress tracking (stars)
 */

/* ========================================
   API CONFIGURATION
   ======================================== */

const API_BASE_URL = 'http://localhost:5000';

/**
 * API Service - Handles all communication with backend
 */
const apiService = {
    /**
     * Check if backend is online
     */
    async checkConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Connection check failed:', error);
            return false;
        }
    },

    /**
     * Get game data from backend
     * @param {string} gameId - The game ID (game1, game2, game3)
     * @param {string} difficulty - Difficulty level (easy/hard)
     */
    async getGameData(gameId, difficulty) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/game/${gameId}/${difficulty}`
            );
            if (!response.ok) throw new Error('Failed to fetch game data');
            return await response.json();
        } catch (error) {
            console.error('Error fetching game data:', error);
            updateConnectionStatus(false);
            return null;
        }
    },

    /**
     * Get all games list
     */
    async getGames() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/games`);
            if (!response.ok) throw new Error('Failed to fetch games');
            return await response.json();
        } catch (error) {
            console.error('Error fetching games:', error);
            return null;
        }
    },

    /**
     * Get total stars from backend
     */
    async getTotalStars() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stars`);
            if (!response.ok) throw new Error('Failed to fetch stars');
            const data = await response.json();
            return data.totalStars || 0;
        } catch (error) {
            console.error('Error fetching stars:', error);
            return 0;
        }
    },

    /**
     * Add stars to backend
     * @param {number} starsEarned - Number of stars earned
     * @param {string} gameId - Which game earned these stars
     */
    async addStars(starsEarned, gameId) {
        try {
            // Allow optional bestReactionTime via extra parameter in args
            const body = { starsEarned: starsEarned, gameId: gameId };
            if (arguments.length > 2 && typeof arguments[2] === 'number') {
                body.bestReactionTime = arguments[2];
            }

            const response = await fetch(`${API_BASE_URL}/api/stars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to add stars');
            return await response.json();
        } catch (error) {
            console.error('Error adding stars:', error);
            return null;
        }
    }
};

/* ========================================
   APPLICATION STATE
   ======================================== */

const appState = {
    currentScreen: 'home',
    sessionStars: 0,
    totalStars: 0,
    difficulty: 'easy',
    gameMode: null,
    isApiConnected: false,
    bestReactionTimeSession: null,

    /**
     * Screen navigation
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        }
    },

    goHome() {
        this.showScreen('homeScreen');
        this.gameMode = null;
        refreshTotalStars();
    },

    /**
     * Reset app for next session
     */
    async resetApp() {
        const lastGame = this.gameMode;
        if (lastGame) {
            await startGame(lastGame);
        } else {
            this.sessionStars = 0;
            updateStarsDisplay();
            this.goHome();
        }
    },

    /**
     * Add star from current game session
     */
    addStar() {
        if (this.sessionStars < 5) {
            this.sessionStars++;
            updateStarsDisplay();
            showVisualFeedback('correct');
            playSound('correct');
            // If session reached 5 stars, finalize session
            if (this.sessionStars >= 5) {
                finalizeSession();
            }
        }
    }
};

/* ========================================
   INITIALIZATION
   ======================================== */

/**
 * Initialize app on page load
 */
document.addEventListener('DOMContentLoaded', async function() {
    initializeApp();
});

async function initializeApp() {
    const isConnected = await apiService.checkConnection();
    appState.isApiConnected = isConnected;
    updateConnectionStatus(isConnected);

    await refreshTotalStars();

    setupEventListeners();
    await loadGamesList();
    playSound('start');
}

/**
 * Dohvati ukupne zvijezdice s backenda i prikaži ih na početnom zaslonu
 */
async function refreshTotalStars() {
    if (!appState.isApiConnected) return;
    const total = await apiService.getTotalStars();
    appState.totalStars = total;
    const el = document.getElementById('homeTotalStarsCount');
    if (el) el.textContent = total;
}

function setupEventListeners() {
    // Speaker button for instructions
    document.getElementById('speakerBtn').addEventListener('click', speakInstructions);

    // Difficulty level changes
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            appState.difficulty = e.target.value;
        });
    });
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(isConnected) {
    const status = document.getElementById('connectionStatus');
    if (isConnected) {
        status.textContent = '✅ Spojeno na server';
        status.classList.add('connected');
        status.classList.remove('error');
    } else {
        status.textContent = '❌ Spajanje na server nije uspjelo';
        status.classList.add('error');
        status.classList.remove('connected');
    }
}

/**
 * Load and display available games from API
 */
async function loadGamesList() {
    const gamesData = await apiService.getGames();
    if (!gamesData || !gamesData.games) return;

    const container = document.getElementById('gameButtonsContainer');
    container.innerHTML = '';

    gamesData.games.forEach(game => {
        const btn = document.createElement('button');
        btn.textContent = `${game.emoji} ${game.name}: ${game.description}`;
        btn.onclick = () => startGame(game.id);
        container.appendChild(btn);
    });
}

/* ========================================
   SCREEN NAVIGATION & SPEECH
   ======================================== */

/**
 * Speak instructions using Web Speech API
 */
function speakInstructions() {
    const message = "Dobrodošao u Igre učenja! " +
        "Igra jedna: Pogledaj sliku i klikni slovo kojim počinje. " +
        "Igra dva: Gledaj boje kako svijetle i klikni ih istim redoslijedom. " +
        "Igra tri: Klikni zvijezdicu što brže možeš! " +
        "Odaberi razinu težine i počni igru.";

    speak(message);
}

// Cached Croatian voice — populated as soon as the browser loads its voice list
let croatianVoice = null;

function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;

    // Open browser console (F12) to see which voices your device has
    console.log('[TTS] Dostupni glasovi:', voices.map(v => `${v.name} (${v.lang})`));

    croatianVoice =
        voices.find(v => v.lang === 'hr-HR') ||
        voices.find(v => v.lang.startsWith('hr')) ||
        voices.find(v => v.name.toLowerCase().includes('matej')) ||
        voices.find(v => v.name.toLowerCase().includes('croatian')) ||
        voices.find(v => v.name.toLowerCase().includes('hrvatski')) ||
        null;

    if (croatianVoice) {
        console.log('[TTS] Odabran glas:', croatianVoice.name, `(${croatianVoice.lang})`);
    } else {
        console.warn('[TTS] Hrvatski glas nije pronađen na ovom uređaju.');
        console.warn('[TTS] Windows: Postavke → Vrijeme i jezik → Govor → Dodaj glasove → Hrvatski');
    }
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hr-HR';
    if (croatianVoice) utterance.voice = croatianVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
}

/* ========================================
   AUDIO SYSTEM
   ======================================== */

/**
 * Play sound effects
 */
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (type === 'correct') {
        playTone(audioContext, 523, 100);
        setTimeout(() => playTone(audioContext, 659, 100), 100);
        setTimeout(() => playTone(audioContext, 784, 200), 200);
    } else if (type === 'incorrect') {
        playTone(audioContext, 440, 150);
        setTimeout(() => playTone(audioContext, 330, 150), 150);
    } else if (type === 'start') {
        playTone(audioContext, 440, 100);
    }
}

/**
 * Play a specific tone
 */
function playTone(audioContext, frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

/* ========================================
   FEEDBACK SYSTEM
   ======================================== */

/**
 * Show visual feedback (green or red flash)
 */
function showVisualFeedback(type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-flash ${type}`;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 500);
}

/**
 * Update star display at the top
 */
function updateStarsDisplay() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < appState.sessionStars) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

/* ========================================
   UTILITIES
   ======================================== */

// Fisher-Yates shuffle — returns a new shuffled array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const LETTER_POOL = ['A','B','C','Č','D','Đ','E','F','G','H','I','J','K','L','M','N','O','P','R','S','Š','T','U','V','Z','Ž'];

// Returns [correctLetter, distractor1, distractor2] in random order
function generateOptions(correctLetter) {
    const pool = LETTER_POOL.filter(l => l !== correctLetter);
    return shuffle([correctLetter, ...shuffle(pool).slice(0, 2)]);
}

/* ========================================
   GAME MANAGEMENT
   ======================================== */

/**
 * Start a game
 */
async function startGame(gameId) {
    appState.gameMode = gameId;
    appState.sessionStars = 0;
    appState.bestReactionTimeSession = null;
    appState._sessionFinalized = false;
    updateStarsDisplay();

    if (gameId === 'game1') {
        await initializeGame1();
        appState.showScreen('game1Screen');
    } else if (gameId === 'game2') {
        await initializeGame2();
        appState.showScreen('game2Screen');
    } else if (gameId === 'game3') {
        await initializeGame3();
        appState.showScreen('game3Screen');
    }
}

/* ========================================
   GAME 1: SLOVA (LETTER RECOGNITION)
   ======================================== */

let game1State = {
    words: [],
    currentIndex: 0,
    correctCount: 0
};

/**
 * Initialize Game 1
 */
async function initializeGame1() {
    const gameData = await apiService.getGameData('game1', appState.difficulty);
    if (!gameData || !gameData.words) {
        speak("Žao mi je, igra se nije mogla učitati. Molim pokušaj ponovo.");
        return;
    }

    const rounds = appState.difficulty === 'easy' ? 5 : 10;
    game1State.words = shuffle(gameData.words).slice(0, rounds);
    game1State.currentIndex = 0;
    game1State.correctCount = 0;
    speak('Pogledaj sliku i klikni slovo kojim počinje.');
    showGame1Word();
}

/**
 * Show the next word in Game 1
 */
function showGame1Word() {
    if (game1State.currentIndex >= game1State.words.length) {
        endGame1();
        return;
    }

    const wordData = game1State.words[game1State.currentIndex];
    const total = game1State.words.length;
    const qNum  = game1State.currentIndex + 1;

    document.getElementById('game1Task').textContent =
        `Pitanje ${qNum}/${total} — Kojim slovom počinje?`;
    document.getElementById('imageDisplay').textContent = wordData.emoji;

    const options = generateOptions(wordData.correct);
    const letterButtonsContainer = document.getElementById('letterButtons');
    letterButtonsContainer.innerHTML = '';

    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-button';
        btn.textContent = letter;
        btn.onclick = () => selectLetter(letter, wordData.correct);
        letterButtonsContainer.appendChild(btn);
    });
}

/**
 * Handle letter selection
 */
function selectLetter(selected, correct) {
    if (selected === correct) {
        game1State.correctCount++;
        speak("Točno! Odličan posao!");

        // Lako: zvijezdica za svaki točan odgovor (5 pitanja = 5 zvijezdica)
        // Teško: zvijezdica svakih 2 točna odgovora (10 pitanja = 5 zvijezdica)
        const awardStar = appState.difficulty === 'easy' || game1State.correctCount % 2 === 0;
        if (awardStar) {
            appState.addStar(); // uključuje vizualni + audio feedback
        } else {
            showVisualFeedback('correct');
            playSound('correct');
        }

        game1State.currentIndex++;
        setTimeout(() => showGame1Word(), 1500);
    } else {
        showVisualFeedback('incorrect');
        playSound('incorrect');
        speak("Pokušaj ponovo!");
    }
}

/**
 * End Game 1
 */
async function endGame1() {
    await finalizeSession();
}

/* ========================================
   GAME 2: MEMORIJA (MEMORY SEQUENCE)
   ======================================== */

let game2State = {
    colors: [],
    sequence: [],
    playerSequence: [],
    isPlaying: false
};

/**
 * Initialize Game 2
 */
async function initializeGame2() {
    const gameData = await apiService.getGameData('game2', appState.difficulty);
    if (!gameData) {
        speak("Žao mi je, igra se nije mogla učitati. Molim pokušaj ponovo.");
        return;
    }

    // Progressive memory: start at level 2 up to 5
    game2State.colors = gameData.colors;
    game2State.playerSequence = [];
    game2State.isPlaying = false;
    game2State.level = 1;

    // Create color squares
    const colorGrid = document.getElementById('colorGrid');
    colorGrid.innerHTML = '';

    game2State.colors.forEach((color, index) => {
        const square = document.createElement('div');
        square.className = 'color-square';
        square.style.backgroundColor = color;
        square.dataset.index = index;
        square.onclick = () => handleColorClick(index);
        colorGrid.appendChild(square);
    });

    // Speak instructions once at start
    speak('Pažljivo gledaj boje. Kada završim, ponovi redoslijed.');
    generateAndStartLevel(game2State.level);
}

/**
 * Start a new round of Game 2
 */
function startGame2Round() {
    game2State.playerSequence = [];
    playSequence();
}

function generateAndStartLevel(level) {
    const sequenceLength = level + 2; // runda 1→3, 2→4, 3→5, 4→6, 5→7 boja
    const seq = [];
    for (let i = 0; i < sequenceLength; i++) {
        seq.push(Math.floor(Math.random() * game2State.colors.length));
    }
    game2State.sequence = seq;
    startGame2Round();
}

/**
 * Play the color sequence
 */
async function playSequence() {
    game2State.isPlaying = true;

    const flashDuration = appState.difficulty === 'easy' ? 1000 : 500;
    const pauseDuration = appState.difficulty === 'easy' ? 500  : 250;

    const sequenceDisplay = document.getElementById('sequenceDisplay');
    sequenceDisplay.textContent = `Runda ${game2State.level}/5 — Pažljivo gledaj (${game2State.sequence.length} boja)...`;

    document.querySelectorAll('.color-square').forEach(sq => {
        sq.style.pointerEvents = 'none';
    });

    for (let i = 0; i < game2State.sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, pauseDuration));
        flashColor(game2State.sequence[i], flashDuration);
        await new Promise(resolve => setTimeout(resolve, flashDuration + pauseDuration));
    }

    document.querySelectorAll('.color-square').forEach(sq => {
        sq.style.pointerEvents = 'auto';
    });

    game2State.isPlaying = false;
    sequenceDisplay.textContent = `Tvoj red! Ponovi ${game2State.sequence.length} boja po redu...`;
}

/**
 * Flash a specific color
 */
function flashColor(index, duration = 300) {
    const squares = document.querySelectorAll('.color-square');
    const square = squares[index];
    square.classList.add('active');

    playColorTone(index);

    setTimeout(() => {
        square.classList.remove('active');
    }, duration);
}

/**
 * Handle color click
 */
function handleColorClick(index) {
    if (game2State.isPlaying) return;

    game2State.playerSequence.push(index);
    flashColor(index);

    // Check correctness
    if (game2State.playerSequence[game2State.playerSequence.length - 1] !== 
        game2State.sequence[game2State.playerSequence.length - 1]) {
        showVisualFeedback('incorrect');
        playSound('incorrect');
        speak("Ups! To nije točno. Pokušajmo ponovo!");
        game2State.playerSequence = [];
        setTimeout(() => playSequence(), 1000);
        return;
    }

    // Check if sequence completed
    if (game2State.playerSequence.length === game2State.sequence.length) {
        showVisualFeedback('correct');
        playSound('correct');
        appState.addStar();

        // If below level 5, go to next level and keep playing
        if (game2State.level < 5) {
            game2State.level++;
            setTimeout(() => {
                generateAndStartLevel(game2State.level);
            }, 1000);
        } else {
            // Completed level 5 -> end game
            setTimeout(() => {
                endGame2();
            }, 1000);
        }
    }
}

/**
 * Play tone for color
 */
function playColorTone(index) {
    const frequencies = [261.63, 329.63, 392.00, 493.88]; // C, E, G, B
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    playTone(audioContext, frequencies[index], 150);
}

/**
 * End Game 2
 */
async function endGame2() {
    // Finalization handled by finalizeSession() when 5 stars reached
    // But if player finished early or API is required now, ensure totals updated
    if (appState.isApiConnected) {
        appState.totalStars = await apiService.getTotalStars();
    }

    showFinalScreen();
}

/* ========================================
   GAME 3: REAKCIJA (REACTION TEST)
   ======================================== */

let game3State = {
    reactionTimes: [],
    starActive: false,
    startTime: 0,
    timeout: 2000,
    attempts: 0,
    successClicks: 0,
    maxAttempts: 10
};

/**
 * Initialize Game 3
 */
async function initializeGame3() {
    const gameData = await apiService.getGameData('game3', appState.difficulty);
    if (!gameData) {
        speak("Žao mi je, igra se nije mogla učitati. Molim pokušaj ponovo.");
        return;
    }

    game3State.reactionTimes = [];
    game3State.starActive = false;
    game3State.timeout = gameData.timeout;
    game3State.attempts = 0;
    game3State.successClicks = 0;
    game3State.maxAttempts = gameData.attempts || 10;
    appState.bestReactionTimeSession = null;

    const reactionInfo = document.getElementById('reactionInfo');
    reactionInfo.textContent = 'Pripremi se... Klikni zvijezdicu!';

    // Speak instruction once at the start
    speak('Klikni zvijezdicu što brže možeš! Jesi li spreman?');

    setTimeout(() => {
        placeRandomStar();
    }, 2000);
}

/**
 * Place star at random position
 */
function placeRandomStar() {
    const gameArea = document.getElementById('gameArea');
    const star = document.getElementById('clickableStar');
    const starSize = 80;
    const padding = 10;

    const maxX = Math.max(0, gameArea.clientWidth  - starSize - padding * 2);
    const maxY = Math.max(0, gameArea.clientHeight - starSize - padding * 2);

    star.style.left = (padding + Math.floor(Math.random() * maxX)) + 'px';
    star.style.top  = (padding + Math.floor(Math.random() * maxY)) + 'px';

    game3State.starActive = true;
    game3State.startTime = performance.now();

    // Na teškoj razini zvjezdica automatski bježi ako nije kliknuta na vrijeme
    if (appState.difficulty === 'hard') {
        setTimeout(() => {
            if (game3State.starActive) {
                missedStar();
            }
        }, game3State.timeout);
    }
    // Na lakoj razini zvjezdica čeka klik bez vremenskog ograničenja
}

/**
 * Promašaj (samo teška razina) — zvjezdica nije kliknuta na vrijeme
 */
function missedStar() {
    game3State.starActive = false;
    game3State.attempts++;

    showVisualFeedback('incorrect');
    playSound('incorrect');

    const reactionInfo = document.getElementById('reactionInfo');
    reactionInfo.textContent = `Promašaj! (${game3State.attempts}/${game3State.maxAttempts}) Budi brži!`;

    if (game3State.attempts >= game3State.maxAttempts) {
        if (game3State.reactionTimes.length > 0) {
            appState.bestReactionTimeSession = Math.min(...game3State.reactionTimes);
        }
        setTimeout(() => endGame3(), 1500);
    } else {
        reactionInfo.textContent += ' Pripremi se...';
        const delay = 600 + Math.random() * 800;
        setTimeout(() => placeRandomStar(), delay);
    }
}

/**
 * Handle star click
 */
function clickStar() {
    if (!game3State.starActive) return;

    const reactionTime = Math.round(performance.now() - game3State.startTime);
    game3State.reactionTimes.push(reactionTime);
    game3State.attempts++;
    game3State.successClicks++;
    game3State.starActive = false;

    const reactionInfo = document.getElementById('reactionInfo');
    reactionInfo.textContent = `Odlično! Kliknuo si za ${reactionTime}ms! (${game3State.attempts}/${game3State.maxAttempts})`;

    const isLast = game3State.attempts >= game3State.maxAttempts;

    // Postavi best time prije addStar() koji može pokrenuti finalizeSession()
    if (isLast) {
        appState.bestReactionTimeSession = Math.min(...game3State.reactionTimes);
    }

    // Zvijezdica svakih 2 uspješna klika → max 5 zvijezdica
    if (game3State.successClicks % 2 === 0) {
        appState.addStar();
    } else {
        showVisualFeedback('correct');
        playSound('correct');
    }

    if (!isLast) {
        reactionInfo.textContent += ' Pripremi se za sljedeću...';
        const delay = 1000 + Math.random() * 2000;
        setTimeout(() => placeRandomStar(), delay);
    } else {
        setTimeout(() => endGame3(), 1500);
    }
}

// Make star clickable
document.addEventListener('click', function(e) {
    if (e.target.id === 'clickableStar' && appState.gameMode === 'game3') {
        clickStar();
    }
});

/**
 * End Game 3
 */
async function endGame3() {
    await finalizeSession();
}

/* ========================================
   FINAL SCREEN
   ======================================== */

/**
 * Show final screen with results
 */
async function showFinalScreen() {
    // Display session stars
    const starsDisplay = '⭐'.repeat(appState.sessionStars);
    document.getElementById('finalStars').textContent = starsDisplay || 'Pokušaj ponovo!';

    // Display total stars
    const totalStars = appState.isApiConnected ? appState.totalStars : appState.sessionStars;
    document.getElementById('totalStars').textContent = totalStars;

    // Display best reaction time if available
    const bestEl = document.getElementById('finalBestReaction');
    if (appState.bestReactionTimeSession != null) {
        bestEl.textContent = `Najbolje reakcijsko vrijeme (ova sesija): ${appState.bestReactionTimeSession} ms`;
    } else {
        bestEl.textContent = '';
    }

    // Speak congratulations
    speak(`Čestitamo! Zaradio si ${appState.sessionStars} zvijezdica u ovoj igri. Ukupno imaš ${totalStars} zvijezdica. Bravo!`);

    appState.showScreen('finalScreen');
}

/**
 * Finalize session: send stars and optional best reaction time to backend once
 */
async function finalizeSession() {
    if (appState._sessionFinalized) return;
    appState._sessionFinalized = true;

    try {
        if (appState.isApiConnected) {
            const resp = await apiService.addStars(appState.sessionStars, appState.gameMode, appState.bestReactionTimeSession);
            if (resp && typeof resp.newTotal === 'number') {
                appState.totalStars = resp.newTotal;
            } else {
                appState.totalStars = await apiService.getTotalStars();
            }
        }
    } catch (err) {
        console.error('Finalize session failed:', err);
    }

    showFinalScreen();
}
