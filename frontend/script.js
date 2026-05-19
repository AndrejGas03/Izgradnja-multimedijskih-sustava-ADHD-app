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
            const response = await fetch(`${API_BASE_URL}/api/stars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    starsEarned: starsEarned,
                    gameId: gameId
                })
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
    },

    /**
     * Reset app for next session
     */
    async resetApp() {
        this.sessionStars = 0;
        updateStarsDisplay();
        this.goHome();
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
    // Check API connection
    const isConnected = await apiService.checkConnection();
    appState.isApiConnected = isConnected;
    updateConnectionStatus(isConnected);

    // Load total stars from backend
    const totalStars = await apiService.getTotalStars();
    appState.totalStars = totalStars;

    // Setup event listeners
    setupEventListeners();

    // Load games list
    await loadGamesList();

    // Play startup sound
    playSound('start');
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
        status.textContent = '✅ Connected to server';
        status.classList.add('connected');
        status.classList.remove('error');
    } else {
        status.textContent = '❌ Server connection failed';
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
    const message = "Welcome to Learning Games! " +
        "Game One: Look at an image and click the letter it starts with. " +
        "Game Two: Watch colors light up and click them in the same order. " +
        "Game Three: Click the star as fast as you can! " +
        "Choose your difficulty level and a game to start.";

    speak(message);
}

/**
 * Generic speech function using Web Speech API
 */
function speak(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
    }
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
   GAME MANAGEMENT
   ======================================== */

/**
 * Start a game
 */
async function startGame(gameId) {
    appState.gameMode = gameId;
    appState.sessionStars = 0;
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
    currentIndex: 0
};

/**
 * Initialize Game 1
 */
async function initializeGame1() {
    const gameData = await apiService.getGameData('game1', appState.difficulty);
    if (!gameData || !gameData.words) {
        speak("Sorry, I couldn't load the game. Please try again.");
        return;
    }

    game1State.words = gameData.words;
    game1State.currentIndex = 0;
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

    // Display image
    document.getElementById('imageDisplay').textContent = wordData.emoji;

    // Shuffle and display letter buttons
    const shuffledOptions = [...wordData.options].sort(() => Math.random() - 0.5);
    const letterButtonsContainer = document.getElementById('letterButtons');
    letterButtonsContainer.innerHTML = '';

    shuffledOptions.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-button';
        btn.textContent = letter;
        btn.onclick = () => selectLetter(letter, wordData.correct);
        letterButtonsContainer.appendChild(btn);
    });

    // Speak task
    speak(`Look at the ${wordData.word}. Click the letter it starts with.`);
}

/**
 * Handle letter selection
 */
function selectLetter(selected, correct) {
    if (selected === correct) {
        showVisualFeedback('correct');
        playSound('correct');
        appState.addStar();
        speak("Correct! Great job!");

        game1State.currentIndex++;
        setTimeout(() => {
            showGame1Word();
        }, 1500);
    } else {
        showVisualFeedback('incorrect');
        playSound('incorrect');
        speak("Try again!");
    }
}

/**
 * End Game 1
 */
async function endGame1() {
    // Save stars to backend
    if (appState.isApiConnected) {
        await apiService.addStars(appState.sessionStars, 'game1');
        appState.totalStars = await apiService.getTotalStars();
    }

    showFinalScreen();
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
        speak("Sorry, I couldn't load the game. Please try again.");
        return;
    }

    game2State.colors = gameData.colors;
    game2State.sequence = gameData.sequence;
    game2State.playerSequence = [];
    game2State.isPlaying = false;

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

    speak("Watch the colors carefully. When I'm done, you copy the pattern.");
    startGame2Round();
}

/**
 * Start a new round of Game 2
 */
function startGame2Round() {
    game2State.playerSequence = [];
    playSequence();
}

/**
 * Play the color sequence
 */
async function playSequence() {
    game2State.isPlaying = true;
    const sequenceDisplay = document.getElementById('sequenceDisplay');
    sequenceDisplay.textContent = 'Watch carefully...';

    // Disable clicks during playback
    document.querySelectorAll('.color-square').forEach(sq => {
        sq.style.pointerEvents = 'none';
    });

    // Play each color
    for (let i = 0; i < game2State.sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        flashColor(game2State.sequence[i]);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Enable clicks for player
    document.querySelectorAll('.color-square').forEach(sq => {
        sq.style.pointerEvents = 'auto';
    });

    game2State.isPlaying = false;
    sequenceDisplay.textContent = 'Your turn! Click the colors in order...';
    speak("Your turn! Click the colors in the same order.");
}

/**
 * Flash a specific color
 */
function flashColor(index) {
    const squares = document.querySelectorAll('.color-square');
    const square = squares[index];
    square.classList.add('active');

    playColorTone(index);

    setTimeout(() => {
        square.classList.remove('active');
    }, 300);
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
        speak("Oops! That's not right. Let's try again!");
        game2State.playerSequence = [];
        setTimeout(() => playSequence(), 1000);
        return;
    }

    // Check if sequence completed
    if (game2State.playerSequence.length === game2State.sequence.length) {
        showVisualFeedback('correct');
        playSound('correct');
        appState.addStar();
        speak("Excellent! You got it right!");
        setTimeout(() => {
            endGame2();
        }, 1500);
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
    if (appState.isApiConnected) {
        await apiService.addStars(appState.sessionStars, 'game2');
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
    timeout: 3000,
    attempts: 0,
    maxAttempts: 3
};

/**
 * Initialize Game 3
 */
async function initializeGame3() {
    const gameData = await apiService.getGameData('game3', appState.difficulty);
    if (!gameData) {
        speak("Sorry, I couldn't load the game. Please try again.");
        return;
    }

    game3State.reactionTimes = [];
    game3State.starActive = false;
    game3State.timeout = gameData.timeout;
    game3State.attempts = 0;
    game3State.maxAttempts = gameData.attempts;

    const reactionInfo = document.getElementById('reactionInfo');
    reactionInfo.textContent = 'Get ready... Click the star!';

    speak("Click the star as fast as you can! Are you ready?");

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

    const maxX = gameArea.clientWidth - 80;
    const maxY = gameArea.clientHeight - 80;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    star.style.left = randomX + 'px';
    star.style.top = randomY + 'px';

    game3State.starActive = true;
    game3State.startTime = Date.now();

    setTimeout(() => {
        if (game3State.starActive) {
            game3State.starActive = false;
            placeRandomStar();
        }
    }, game3State.timeout);
}

/**
 * Handle star click
 */
function clickStar() {
    if (!game3State.starActive) return;

    const reactionTime = Date.now() - game3State.startTime;
    game3State.reactionTimes.push(reactionTime);
    game3State.attempts++;
    game3State.starActive = false;

    showVisualFeedback('correct');
    playSound('correct');

    const reactionInfo = document.getElementById('reactionInfo');
    reactionInfo.textContent = `Great! You clicked in ${reactionTime}ms!`;

    appState.addStar();

    // Check if done
    if (game3State.attempts < game3State.maxAttempts) {
        reactionInfo.textContent += ' Get ready for the next one...';
        setTimeout(() => {
            placeRandomStar();
        }, 1000);
    } else {
        setTimeout(() => {
            endGame3();
        }, 1500);
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
    if (appState.isApiConnected) {
        await apiService.addStars(appState.sessionStars, 'game3');
        appState.totalStars = await apiService.getTotalStars();
    }

    showFinalScreen();
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
    document.getElementById('finalStars').textContent = starsDisplay || 'Try again!';

    // Display total stars
    const totalStars = appState.isApiConnected ? appState.totalStars : appState.sessionStars;
    document.getElementById('totalStars').textContent = totalStars;

    // Speak congratulations
    speak(`Congratulations! You earned ${appState.sessionStars} stars in this game. Your total is ${totalStars} stars. Bravo!`);

    appState.showScreen('finalScreen');
}
