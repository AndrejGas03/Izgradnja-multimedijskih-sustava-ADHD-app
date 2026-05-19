# ADHD Educational App - Full Stack Implementation

A professional-grade educational web application designed for children with ADHD and dyslexia, featuring three interactive games with a robust backend API.

## 🎯 Project Overview

This application follows ADHD and dyslexia-friendly design principles:
- **Minimalist UI**: Zero visual clutter, one task per screen
- **High Contrast**: Dark blue text on cream background
- **Large Typography**: Accessible fonts (Arial, 18px+)
- **Web Speech API**: Audio instructions and feedback
- **Immediate Feedback**: Visual flashes and sound effects

## 📁 Project Structure

```
ADHD APP - MULTIMEDIJSKI SUSTAVI/
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Express API server
│   └── data.json             # JSON database (star tracking)
├── frontend/
│   ├── index.html            # HTML structure
│   ├── style.css             # ADHD-friendly styles
│   └── script.js             # Application logic & API calls
├── package.json              # Root package configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

3. **Open Frontend in Browser**
   - Open your browser and navigate to: `http://localhost:5000`
   - The frontend files are served automatically by the Express server

## 🎮 Three Games Included

### Game 1: Slova (Letter Recognition)
- **Description**: Display an image (emoji) and 3 letter buttons
- **Task**: Click the correct starting letter
- **Difficulty**: 
  - Easy: Apple, Ball, Cat, Dog, Elephant
  - Hard: Zebra, Xylophone, Quilt, Violin, Walrus
- **API**: `GET /api/game/game1/:difficulty`

### Game 2: Memorija (Memory Sequence)
- **Description**: Watch a sequence of colored squares flash
- **Task**: Repeat the sequence by clicking the squares
- **Difficulty**:
  - Easy: 2-color sequence
  - Hard: 3-color sequence
- **API**: `GET /api/game/game2/:difficulty`

### Game 3: Reakcija (Reaction Test)
- **Description**: Click a randomly appearing star
- **Task**: React as fast as possible
- **Difficulty**:
  - Easy: 3-second timeout between moves
  - Hard: 2-second timeout between moves
- **API**: `GET /api/game/game3/:difficulty`

## 🔌 API Endpoints

### Health Check
```
GET /health
Response: { status: 'ok', message: '...', timestamp: '...' }
```

### Get Available Games
```
GET /api/games
Response: { success: true, games: [...] }
```

### Get Game Data
```
GET /api/game/:gameId/:difficulty
Example: GET /api/game/game1/easy
Response: { success: true, game: 'game1', words: [...], ... }
```

### Get Total Stars
```
GET /api/stars
Response: { success: true, totalStars: 5, sessionCount: 2 }
```

### Add Stars to Total
```
POST /api/stars
Body: { "starsEarned": 3, "gameId": "game1" }
Response: { success: true, newTotal: 8, sessionCount: 3 }
```

### Reset Data (Testing)
```
GET /api/reset
Response: { success: true, message: 'Data reset successfully' }
```

## ✨ Key Features

### Frontend Features
- ✅ **Web Speech API**: Audio instructions and feedback
- ✅ **Real-time API Communication**: Fetch using Async/Await
- ✅ **Visual Feedback**: Green flashes for correct, red for incorrect
- ✅ **Sound Effects**: Ascending tones for success, descending for errors
- ✅ **Star Progress System**: 5-star tracking per session
- ✅ **Difficulty Selector**: Easy and Hard modes
- ✅ **Connection Status**: Real-time backend connection indicator
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop

### Backend Features
- ✅ **Express Server**: RESTful API architecture
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **Data Persistence**: JSON file storage for star tracking
- ✅ **Game Data Management**: Centralized game configuration
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Session Tracking**: Tracks number of game sessions

## 🎨 Design Principles

### ADHD Optimization
- Zero background animations or distractions
- Clear, one-step-at-a-time instructions
- Immediate positive reinforcement (stars, sounds, praise)
- Large touch targets (buttons sized for children)
- Consistent layout across all screens

### Dyslexia Support
- Open, clear sans-serif font (Arial)
- Large font sizes (18px minimum)
- High contrast colors (dark blue #1a3a52 on cream #f5f3e9)
- Adequate line spacing (1.6 line-height)
- No decorative elements or clutter

## 📊 Data Storage

Stars are persistently stored in `backend/data.json`:
```json
{
  "totalStars": 0,
  "sessionCount": 0,
  "lastUpdated": "2026-05-06T00:00:00.000Z"
}
```

Each POST to `/api/stars` updates this file automatically.

## 🔊 Accessibility Features

### Web Speech API
- Instructions read aloud automatically
- Slower speech rate (0.9x) for clarity
- Controllable via speaker button on home screen

### Visual Feedback
- Green screen flash for correct answers
- Red screen flash for incorrect answers
- Animated star filling on progress bar

### Audio Feedback
- Success: Ascending C5 → E5 → G5 tones
- Error: Descending A4 → E4 tones
- Color tones in memory game (C, E, G, B frequencies)

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Try on a different port:
PORT=3000 npm start
```

### Frontend can't connect to API
- Ensure backend is running on http://localhost:5000
- Check browser console (F12) for error messages
- Verify CORS is enabled (it is by default)

### Stars not persisting
- Check that `backend/data.json` exists
- Verify backend has write permissions to the directory
- Check backend console for error messages

## 📝 Code Organization

### Backend (`server.js`)
- **Utility Functions**: `loadData()`, `saveData()`
- **Game Data**: `game1Data`, `game2Data`, `game3Data`
- **API Routes**: `/health`, `/api/stars`, `/api/games`, `/api/game/:gameId/:difficulty`

### Frontend (`script.js`)
- **API Service**: `apiService` object with all fetch methods
- **Application State**: `appState` for managing current game/stars
- **Game Logic**: Separate functions for each game
- **Audio System**: `speak()`, `playSound()`, `playTone()`
- **UI Updates**: Screen navigation and display updates

### Styling (`style.css`)
- **Global Styles**: Color scheme, typography, spacing
- **Component Styles**: Buttons, stars, game areas
- **Responsive Design**: Media queries for mobile/tablet

## 🎓 Defense Preparation

### Key Points to Explain
1. **Architecture**: Separation of concerns (Frontend/Backend)
2. **API Design**: RESTful endpoints for game data and persistence
3. **Accessibility**: ADHD/dyslexia-friendly design principles
4. **State Management**: How stars are tracked and saved
5. **User Experience**: Immediate feedback and encouragement

### Demo Scenarios
1. Start the app and explain the home screen layout
2. Play Game 1: Show how API fetches word data
3. Play Game 2: Explain sequence logic
4. Play Game 3: Show reaction time tracking
5. Finish game: Show stars saved to backend and total stars displayed

## 📚 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Web Speech API
- **Backend**: Node.js, Express.js
- **Data Storage**: JSON file system
- **Communication**: Fetch API with Async/Await, CORS

## 📄 License

MIT License - Feel free to modify and use for educational purposes.

---

**Built for educational accessibility and ADHD-friendly design** ♿✨
