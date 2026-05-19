/**
 * ADHD Educational App - Backend Server
 * Node.js + Express API for game data and user progress tracking
 * 
 * Endpoints:
 * GET  /api/stars           - Get total stars earned
 * POST /api/stars           - Add stars to total
 * GET  /api/games/:gameId   - Get game-specific data
 * GET  /health              - Health check
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES6 modules (__dirname equivalent)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Data file paths
const dataFile = path.join(__dirname, 'data.json');

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Load all user data from JSON file
 * If file doesn't exist, initialize with default data
 */
function loadData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading data:', error);
    }

    // Return default data if file doesn't exist
    return {
        totalStars: 0,
        sessionCount: 0,
        lastUpdated: new Date().toISOString(),
        // Track best reaction time ever (ms)
        bestReactionTimeAllTime: null,
        // Last session's best reaction time
        lastBestReactionTime: null
    };
}

/**
 * Save user data to JSON file
 */
function saveData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// =====================================================
// GAME DATA
// =====================================================

/**
 * Game 1: Slova (Letter Recognition)
 * Returns image and letter options
 */
const game1Data = {
    // Updated to a 5-question array for sequential rounds
    easy: [
        { word: 'Apple', emoji: '🍎', correct: 'A', options: ['A', 'S', 'M'] },
        { word: 'Sun', emoji: '☀️', correct: 'S', options: ['S', 'A', 'T'] },
        { word: 'Cat', emoji: '🐱', correct: 'C', options: ['C', 'K', 'S'] },
        { word: 'Dog', emoji: '🐕', correct: 'D', options: ['D', 'B', 'G'] },
        { word: 'Tree', emoji: '🌳', correct: 'T', options: ['T', 'L', 'P'] }
    ],
    hard: [
        { word: 'Zebra', emoji: '🦓', correct: 'Z', options: ['Z', 'S', 'X'] },
        { word: 'Xylophone', emoji: '🎵', correct: 'X', options: ['X', 'Z', 'V'] },
        { word: 'Quilt', emoji: '🧵', correct: 'Q', options: ['Q', 'O', 'P'] },
        { word: 'Violin', emoji: '🎻', correct: 'V', options: ['V', 'W', 'U'] },
        { word: 'Walrus', emoji: '🦭', correct: 'W', options: ['W', 'V', 'Y'] }
    ]
};

/**
 * Game 2: Memorija (Memory Sequence)
 * Color data and sequence logic
 */
const game2Data = {
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
    sequences: {
        easy: [0, 1],
        hard: [0, 2, 1]
    }
};

/**
 * Game 3: Reakcija (Reaction Test)
 * Timeout configuration
 */
const game3Data = {
    timeouts: {
        easy: 3000,
        hard: 2000
    },
    // Increase attempts to 5 for multi-star session
    attempts: 5
};

// =====================================================
// API ENDPOINTS
// =====================================================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ADHD Educational App Backend is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/stars
 * Retrieve total stars earned across all sessions
 */
app.get('/api/stars', (req, res) => {
    try {
        const data = loadData();
        res.json({
            success: true,
            totalStars: data.totalStars,
            sessionCount: data.sessionCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve stars'
        });
    }
});

/**
 * POST /api/stars
 * Add stars to the user's total (called after each game session)
 * 
 * Request body:
 * {
 *   "starsEarned": 3,
 *   "gameId": "game1"
 * }
 */
app.post('/api/stars', (req, res) => {
    try {
        const { starsEarned, gameId, bestReactionTime } = req.body;

        // Validate input
        if (typeof starsEarned !== 'number' || starsEarned < 0 || starsEarned > 5) {
            return res.status(400).json({
                success: false,
                error: 'Invalid stars value. Must be 0-5.'
            });
        }

        // Load and update data
        let data = loadData();
        data.totalStars = (data.totalStars || 0) + starsEarned;
        data.sessionCount = (data.sessionCount || 0) + 1;
        data.lastUpdated = new Date().toISOString();
        data.lastGameId = gameId || 'unknown';

        // If bestReactionTime provided (ms), update lastBest and all-time best
        if (typeof bestReactionTime === 'number' && !isNaN(bestReactionTime)) {
            data.lastBestReactionTime = bestReactionTime;
            if (data.bestReactionTimeAllTime == null || bestReactionTime < data.bestReactionTimeAllTime) {
                data.bestReactionTimeAllTime = bestReactionTime;
            }
        }

        // Save updated data
        if (saveData(data)) {
            res.json({
                success: true,
                message: `Added ${starsEarned} stars`,
                newTotal: data.totalStars,
                sessionCount: data.sessionCount,
                lastBestReactionTime: data.lastBestReactionTime || null,
                bestReactionTimeAllTime: data.bestReactionTimeAllTime || null
            });
        } else {
            throw new Error('Failed to save data');
        }
    } catch (error) {
        console.error('Error in POST /api/stars:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update stars'
        });
    }
});

/**
 * GET /api/game/:gameId/:difficulty
 * Retrieve game-specific data based on game ID and difficulty level
 * 
 * Supports:
 * - /api/game/game1/easy  -> Letter recognition words (easy)
 * - /api/game/game1/hard  -> Letter recognition words (hard)
 * - /api/game/game2/easy  -> Memory game config (easy)
 * - /api/game/game2/hard  -> Memory game config (hard)
 * - /api/game/game3/easy  -> Reaction test config (easy)
 * - /api/game/game3/hard  -> Reaction test config (hard)
 */
app.get('/api/game/:gameId/:difficulty', (req, res) => {
    try {
        const { gameId, difficulty } = req.params;

        // Validate difficulty
        if (!['easy', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                success: false,
                error: 'Difficulty must be "easy" or "hard"'
            });
        }

        let gameData = null;

        if (gameId === 'game1') {
            // Game 1: Slova - Letter Recognition
            gameData = {
                success: true,
                game: 'game1',
                name: 'Slova - Letter Recognition',
                difficulty: difficulty,
                words: game1Data[difficulty],
                description: 'Click the starting letter of the image'
            };
        } else if (gameId === 'game2') {
            // Game 2: Memorija - Memory Sequence
            gameData = {
                success: true,
                game: 'game2',
                name: 'Memorija - Memory Sequence',
                difficulty: difficulty,
                colors: game2Data.colors,
                sequence: game2Data.sequences[difficulty],
                description: 'Repeat the color sequence'
            };
        } else if (gameId === 'game3') {
            // Game 3: Reakcija - Reaction Test
            gameData = {
                success: true,
                game: 'game3',
                name: 'Reakcija - Reaction Test',
                difficulty: difficulty,
                timeout: game3Data.timeouts[difficulty],
                attempts: game3Data.attempts,
                description: 'Click the star as fast as you can'
            };
        } else {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }

        res.json(gameData);
    } catch (error) {
        console.error('Error in GET /api/game:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve game data'
        });
    }
});

/**
 * GET /api/games
 * Get all available games summary
 */
app.get('/api/games', (req, res) => {
    res.json({
        success: true,
        games: [
            {
                id: 'game1',
                name: 'Slova',
                description: 'Find the starting letter',
                emoji: '🔤'
            },
            {
                id: 'game2',
                name: 'Memorija',
                description: 'Memory color sequence',
                emoji: '🎨'
            },
            {
                id: 'game3',
                name: 'Reakcija',
                description: 'Catch the star fast',
                emoji: '⚡'
            }
        ]
    });
});

/**
 * GET /api/reset
 * Reset all data (for testing/demo purposes)
 */
app.get('/api/reset', (req, res) => {
    try {
        const defaultData = {
            totalStars: 0,
            sessionCount: 0,
            lastUpdated: new Date().toISOString()
        };
        saveData(defaultData);
        res.json({
            success: true,
            message: 'Data reset successfully',
            data: defaultData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to reset data'
        });
    }
});

/**
 * 404 - Not Found handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  ADHD Educational App - Backend Server             ║
║  Running on http://localhost:${PORT}               ║
║                                                    ║
║  Endpoints:                                        ║
║  GET  /health                                      ║
║  GET  /api/stars                                   ║
║  POST /api/stars                                   ║
║  GET  /api/games                                   ║
║  GET  /api/game/:gameId/:difficulty                ║
║  GET  /api/reset                                   ║
╚════════════════════════════════════════════════════╝
    `);
});
