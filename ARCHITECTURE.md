# Architecture & Technical Documentation

## 📋 Project Deliverables

### Complete File Structure
```
ADHD APP - MULTIMEDIJSKI SUSTAVI/
│
├── 📄 README.md                          (Main documentation)
├── 📄 SETUP.md                           (Quick start guide)
├── 📄 ARCHITECTURE.md                    (This file)
├── 📄 package.json                       (Root project config)
├── 📄 .gitignore                         (Git ignore rules)
├── 📄 index.html                         (Old single-file version)
│
├── 📁 backend/                           (Express API Server)
│   ├── 📄 server.js                      (Main server file - 350+ lines)
│   ├── 📄 package.json                   (Backend dependencies)
│   └── 📄 data.json                      (Persistent star storage)
│
└── 📁 frontend/                          (Client Application)
    ├── 📄 index.html                     (HTML structure)
    ├── 📄 style.css                      (ADHD-friendly styling)
    └── 📄 script.js                      (Main application logic - 600+ lines)
```

## 🏗️ Architecture Overview

### Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WEB BROWSER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          FRONTEND (Vanilla JavaScript)           │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ index.html (Structure)                     │  │  │
│  │  │ - Home screen                              │  │  │
│  │  │ - 3 Game screens                           │  │  │
│  │  │ - Final screen                             │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ style.css (Styling - 600+ lines)           │  │  │
│  │  │ - ADHD-friendly colors                     │  │  │
│  │  │ - Large typography                         │  │  │
│  │  │ - Responsive design                        │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ script.js (Logic - 600+ lines)             │  │  │
│  │  │ - API communication                        │  │  │
│  │  │ - Game logic for 3 games                   │  │  │
│  │  │ - Web Speech API integration               │  │  │
│  │  │ - Audio feedback system                    │  │  │
│  │  │ - State management                         │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                    ⬍ ⬍ ⬍ Fetch API                     │
└─────────────────────────────────────────────────────────┘
                    HTTP Requests
                    JSON Responses
┌─────────────────────────────────────────────────────────┐
│         BACKEND (Node.js + Express Server)              │
│  Running on: http://localhost:5000                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ server.js (350+ lines)                             │ │
│  │                                                    │ │
│  │ 1. API Endpoints:                                  │ │
│  │    - GET  /health                                  │ │
│  │    - GET  /api/games                               │ │
│  │    - GET  /api/game/:gameId/:difficulty            │ │
│  │    - GET  /api/stars                               │ │
│  │    - POST /api/stars                               │ │
│  │    - GET  /api/reset                               │ │
│  │                                                    │ │
│  │ 2. Game Data (Hardcoded):                           │ │
│  │    - game1Data (5 easy + 5 hard words)              │ │
│  │    - game2Data (color config & sequences)           │ │
│  │    - game3Data (timeout settings)                   │ │
│  │                                                    │ │
│  │ 3. Data Persistence:                               │ │
│  │    - loadData() → reads from JSON                   │ │
│  │    - saveData() → writes to JSON                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ data.json (JSON Database)                          │ │
│  │ {                                                  │ │
│  │   "totalStars": 0,                                 │ │
│  │   "sessionCount": 0,                               │ │
│  │   "lastUpdated": "2026-05-06T00:00:00.000Z"        │ │
│  │ }                                                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

### Game Session Flow

```
1. USER STARTS APP
   ↓
2. Frontend loads → Checks API connection
   ↓
3. Backend online? → Show "✅ Connected"
   ↓
4. Fetch /api/games → Display 3 game buttons
   ↓
5. User selects game + difficulty
   ↓
6. Fetch /api/game/{gameId}/{difficulty} → Get game data
   ↓
7. Display game and START PLAYING
   ↓
8. For each correct answer → Add star (frontend visual)
   ↓
9. Game ends
   ↓
10. POST /api/stars {starsEarned, gameId} → Save to backend
    ↓
11. Fetch /api/stars → Get total stars from database
    ↓
12. Display final screen with total stars
    ↓
13. "Play Again" or "Back to Home"
```

## 🎮 Three Games: Implementation Details

### GAME 1: SLOVA (Letter Recognition)

**Frontend Logic (script.js)**
```javascript
// State management
game1State = {
    words: [],           // Fetched from backend
    currentIndex: 0      // Track progress
}

// Flow
initializeGame1() → getGameData('game1', difficulty)
    ↓
showGame1Word() → Display emoji + shuffle options
    ↓
selectLetter() → Check if correct
    ↓
If correct: addStar() + next word
If wrong: showVisualFeedback('incorrect') + replay
```

**Backend Data (server.js)**
```javascript
game1Data = {
    easy: [
        { word: 'Apple', emoji: '🍎', correct: 'A', options: ['A', 'P', 'M'] },
        // ... 4 more easy words
    ],
    hard: [
        { word: 'Zebra', emoji: '🦓', correct: 'Z', options: ['Z', 'S', 'X'] },
        // ... 4 more hard words
    ]
}
```

---

### GAME 2: MEMORIJA (Memory Sequence)

**Frontend Logic (script.js)**
```javascript
// State management
game2State = {
    colors: [],           // 4 colors from backend
    sequence: [],         // 2-3 color indices
    playerSequence: [],   // Track player input
    isPlaying: false      // Prevent clicks during playback
}

// Flow
initializeGame2() → getGameData('game2', difficulty)
    ↓
playSequence() → Flash each color in sequence
    ↓
User clicks colors → handleColorClick()
    ↓
Compare with sequence[playerIndex]
    ↓
If all correct: addStar() + endGame2()
If wrong: Reset + replay sequence
```

**Backend Data (server.js)**
```javascript
game2Data = {
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
    sequences: {
        easy: [0, 1],      // 2-color sequence
        hard: [0, 2, 1]    // 3-color sequence
    }
}
```

---

### GAME 3: REAKCIJA (Reaction Test)

**Frontend Logic (script.js)**
```javascript
// State management
game3State = {
    reactionTimes: [],    // Array of times
    starActive: false,    // Star clickable?
    startTime: 0,         // When star appeared
    timeout: 3000,        // ms before new star
    attempts: 0,          // Completed attempts
    maxAttempts: 3        // Total tries
}

// Flow
initializeGame3() → getGameData('game3', difficulty)
    ↓
placeRandomStar() → Position at random (x, y)
    ↓
User clicks → clickStar()
    ↓
Calculate: reactionTime = now - startTime
    ↓
addStar() + Display reaction time
    ↓
If attempts < 3: Show next star
If attempts === 3: endGame3()
```

**Backend Data (server.js)**
```javascript
game3Data = {
    timeouts: {
        easy: 3000,  // 3 seconds
        hard: 2000   // 2 seconds
    },
    attempts: 3
}
```

## 🔌 API Endpoints (Detailed)

### 1. Health Check
```
GET /health

Purpose: Verify backend is online
Called by: Frontend on app load
Response:
{
  "status": "ok",
  "message": "ADHD Educational App Backend is running",
  "timestamp": "2026-05-06T14:30:00.000Z"
}
```

### 2. Get All Games
```
GET /api/games

Purpose: Load game list for home screen
Called by: Frontend during app initialization
Response:
{
  "success": true,
  "games": [
    {
      "id": "game1",
      "name": "Slova",
      "description": "Find the starting letter",
      "emoji": "🔤"
    },
    // ... game2, game3
  ]
}
```

### 3. Get Game Data
```
GET /api/game/{gameId}/{difficulty}

Purpose: Fetch game-specific configuration
Called by: Frontend when starting a game
Examples:
  - GET /api/game/game1/easy
  - GET /api/game/game2/hard
  - GET /api/game/game3/easy

Response Example (game1):
{
  "success": true,
  "game": "game1",
  "name": "Slova - Letter Recognition",
  "difficulty": "easy",
  "words": [
    { "word": "Apple", "emoji": "🍎", "correct": "A", "options": ["A", "P", "M"] },
    // ... more words
  ],
  "description": "Click the starting letter of the image"
}
```

### 4. Get Total Stars
```
GET /api/stars

Purpose: Retrieve accumulated stars from database
Called by: Frontend on app load and after game completion
Response:
{
  "success": true,
  "totalStars": 8,
  "sessionCount": 2
}
```

### 5. Add Stars
```
POST /api/stars

Purpose: Save stars earned in current game session
Called by: Frontend after each game ends
Request Body:
{
  "starsEarned": 3,     // 0-5 stars from this game
  "gameId": "game1"     // Which game was played
}

Response:
{
  "success": true,
  "message": "Added 3 stars",
  "newTotal": 11,
  "sessionCount": 3
}
```

### 6. Reset Data
```
GET /api/reset

Purpose: Reset all data (testing/demo)
Called by: Manual testing
Response:
{
  "success": true,
  "message": "Data reset successfully",
  "data": {
    "totalStars": 0,
    "sessionCount": 0,
    "lastUpdated": "2026-05-06T14:30:00.000Z"
  }
}
```

## 🎨 ADHD & Dyslexia Design Implementation

### Color Scheme
```
Primary Background: #f5f3e9 (Cream - reduces eye strain)
Text Color:         #1a3a52 (Dark blue - high contrast)
Secondary BG:       #e8e5d6 (Lighter cream - sections)
Button Color:       #2d5a7b (Medium blue - visually distinct)
Success Flash:      rgba(34, 197, 94, 0.3) (Green)
Error Flash:        rgba(239, 68, 68, 0.3) (Red)
```

### Typography
```
Font Family: Arial (sans-serif, clean)
Headings:    48px (h1), 36px (h2), 24px (h3)
Body:        18px (minimum)
Line Height: 1.6 (adequate spacing)
Letter Spacing: 1-2px (clarity)
```

### Minimalist Layout
```
Rule 1: One task per screen
  ✓ Home: Choose game + difficulty
  ✓ Game: One specific game, nothing else
  ✓ Final: Results only

Rule 2: Large touch targets
  ✓ Buttons: 120x120px (large enough for children)
  ✓ Stars: 48px (easy to see)
  ✓ Game areas: Full screen width

Rule 3: No distractions
  ✓ No animations except feedback
  ✓ No background music or sounds (only when needed)
  ✓ No popups or extra elements
```

## 🔊 Accessibility Features

### Web Speech API Integration
```javascript
// Function available globally
speak(text) → speechSynthesis.speak()
  - Rate: 0.9x (slower)
  - Pitch: 1.0 (normal)
  - Volume: 1.0 (max)
  - Used for: Instructions, feedback, encouragement
```

### Audio Feedback System
```javascript
playSound(type):
  - 'correct': C5 (523Hz) → E5 (659Hz) → G5 (784Hz)
    (Ascending success pattern)
  - 'incorrect': A4 (440Hz) → E4 (330Hz)
    (Descending error pattern)
  - 'start': A4 (440Hz)
    (Simple startup tone)

playColorTone(index):
  - Color 0: C4 (261.63Hz)
  - Color 1: E4 (329.63Hz)
  - Color 2: G4 (392.00Hz)
  - Color 3: B4 (493.88Hz)
```

### Visual Feedback
```javascript
showVisualFeedback(type):
  - Type 'correct': Green flash 0.5s
  - Type 'incorrect': Red flash 0.5s
  - Animation: Fade out over 500ms
  - Position: Full screen overlay
```

## 📊 State Management

### Frontend State (appState)
```javascript
appState = {
    currentScreen: 'home',        // Which screen showing
    sessionStars: 0,              // Stars in this session (0-5)
    totalStars: 0,                // Total across all sessions
    difficulty: 'easy',           // Selected difficulty
    gameMode: null,               // Current game ID or null
    isApiConnected: false         // Backend online?
}
```

### Game-Specific States
```javascript
game1State = { words: [], currentIndex: 0 }
game2State = { colors: [], sequence: [], playerSequence: [], isPlaying: false }
game3State = { reactionTimes: [], starActive: false, startTime: 0, ... }
```

## 🧪 Testing Checklist

### API Testing
- [ ] `curl http://localhost:5000/health` → Returns status: ok
- [ ] `curl http://localhost:5000/api/games` → Returns 3 games
- [ ] `curl http://localhost:5000/api/game/game1/easy` → Returns words
- [ ] `curl http://localhost:5000/api/stars` → Returns totalStars
- [ ] `curl -X POST http://localhost:5000/api/stars -d '...'` → Saves stars

### Frontend Testing
- [ ] App loads and shows "✅ Connected"
- [ ] Home screen displays all 3 games
- [ ] Difficulty selector works (Easy/Hard)
- [ ] Speaker button plays instructions
- [ ] Game 1: Can select letters and earn stars
- [ ] Game 2: Can repeat color sequence
- [ ] Game 3: Star appears and reaction time tracked
- [ ] Final screen shows total stars
- [ ] Play Again resets session stars but keeps total
- [ ] Back to Home returns to selection screen

### Data Persistence
- [ ] Play a game and earn stars
- [ ] Refresh page → Total stars remain
- [ ] Start new game → Session stars reset to 0
- [ ] Earn more stars → Total increases
- [ ] Check `backend/data.json` → Numbers match

## 📈 Performance Considerations

### Frontend Optimization
- Vanilla JavaScript (no framework overhead)
- CSS animations use transform (GPU accelerated)
- Fetch API with async/await (non-blocking)
- No unused DOM manipulation

### Backend Optimization
- Express serves static files efficiently
- CORS pre-configured
- Minimal middleware
- JSON file I/O is fast for small data

### Scalability Notes
- Current: File-based storage (JSON)
- Future: Replace with database (MongoDB, PostgreSQL)
- Current: Game data hardcoded in server
- Future: Move to separate data files or database

## 🎓 Defense Talking Points

### Architecture Benefits
1. **Separation of Concerns**: Frontend and Backend independent
2. **API-First Design**: Allows future mobile apps (iOS, Android)
3. **Data Persistence**: Backend ensures stars survive across sessions
4. **Scalability**: Easy to add more games via API

### ADHD Optimization
1. **Zero Clutter**: Minimalist interface, one task at a time
2. **Immediate Feedback**: Every action gets instant visual/audio response
3. **Progress Visible**: Star system provides motivation
4. **Clear Instructions**: Web Speech API reads everything aloud

### Dyslexia Support
1. **High Contrast**: Dark blue on cream background
2. **Large Font**: 18px minimum, bigger for headings
3. **Sans-Serif**: Arial font (open letterforms)
4. **Spacing**: 1.6 line height, adequate margins

### Technical Excellence
1. **RESTful API**: Standard design patterns
2. **Error Handling**: Graceful failures with user feedback
3. **Responsive Design**: Works on all screen sizes
4. **Code Comments**: Well-documented for maintenance

---

**Total Lines of Code**
- Backend: ~350 lines (server.js)
- Frontend HTML: ~90 lines (index.html)
- Frontend CSS: ~650 lines (style.css)
- Frontend JS: ~600 lines (script.js)
- **Total: ~1,700 lines**

**All requirements met ✅**
