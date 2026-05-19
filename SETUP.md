# Quick Setup Guide

## 📦 Installation Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

Expected output:
```
added 50+ packages
```

### Step 2: Start the Backend Server
```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════════════════╗
║  ADHD Educational App - Backend Server             ║
║  Running on http://localhost:5000               ║
║                                                    ║
║  Endpoints:                                        ║
║  GET  /health                                      ║
║  GET  /api/stars                                   ║
║  POST /api/stars                                   ║
║  GET  /api/games                                   ║
║  GET  /api/game/:gameId/:difficulty                ║
║  GET  /api/reset                                   ║
╚════════════════════════════════════════════════════╝
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5000**

You should see:
- ✅ Connected to server indicator (green)
- Home screen with 3 game buttons
- Difficulty selector (Easy/Hard)
- Speaker button for instructions

## 🎮 First Run Checklist

- [ ] Backend server is running (terminal shows listening message)
- [ ] Browser shows green "Connected to server" message
- [ ] Home screen displays all 3 games
- [ ] Speaker button works (click to hear instructions)
- [ ] Difficulty selector works (can toggle Easy/Hard)
- [ ] Can start a game

## 🧪 Testing Each Game

### Game 1: Slova (Letter Recognition)
1. Click "Game 1: Letter Sounds"
2. See an image emoji and 3 letter buttons
3. Click the correct starting letter
4. Should see green flash and hear success sound
5. Next word appears automatically

### Game 2: Memorija (Memory Sequence)
1. Click "Game 2: Memory Colors"
2. Watch 2-3 colored squares flash
3. Click squares in the same order
4. Should see green flash on correct sequence
5. Game ends and returns to final screen

### Game 3: Reakcija (Reaction Test)
1. Click "Game 3: Quick Click"
2. See a random star on blank screen
3. Click it as fast as possible
4. See reaction time and next star appears
5. 3 attempts total

## 📊 Checking Stars Persistence

### Via API (using curl or Postman)
```bash
# Get current total stars
curl http://localhost:5000/api/stars

# Add stars (example: add 3 stars from game1)
curl -X POST http://localhost:5000/api/stars \
  -H "Content-Type: application/json" \
  -d '{"starsEarned": 3, "gameId": "game1"}'

# Reset (for testing)
curl http://localhost:5000/api/reset
```

### Via Backend File
Check `backend/data.json` to see current star count:
```json
{
  "totalStars": 8,
  "sessionCount": 2,
  "lastUpdated": "2026-05-06T14:30:00.000Z"
}
```

## 🔧 Changing Settings

### Change Backend Port
In terminal, before starting:
```bash
PORT=3000 npm start
# Now access at http://localhost:3000
```

### Reset All Data
```bash
curl http://localhost:5000/api/reset
```

## ❓ Common Issues & Solutions

### "Cannot find module 'express'"
**Solution**: Run `npm install` in the backend folder

### "Port 5000 already in use"
**Solution**: 
```bash
# Use different port
PORT=3000 npm start
```

### Frontend shows "❌ Server connection failed"
**Solution**:
- Ensure backend is running
- Check that backend is on http://localhost:5000
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

### Stars not saving
**Solution**:
- Check `backend/data.json` exists
- Verify write permissions
- Check backend console for errors
- Try resetting: `curl http://localhost:5000/api/reset`

## 📱 Mobile Testing

The app is fully responsive. Test on different devices:
```bash
# On mobile/tablet:
# Replace localhost with your computer's IP address
http://192.168.1.X:5000  (find your IP with: ipconfig on Windows, ifconfig on Mac/Linux)
```

## 🎯 Ready for Defense?

Before your presentation:
1. ✅ Test backend starts without errors
2. ✅ Test frontend loads and connects
3. ✅ Test all 3 games work in Easy mode
4. ✅ Test all 3 games work in Hard mode
5. ✅ Test speaker button reads instructions
6. ✅ Test stars persist across sessions
7. ✅ Verify connection status indicator works

## 📞 Support

If you encounter any issues:
1. Check the main README.md for architecture details
2. Look at backend/server.js comments for API logic
3. Check browser console (F12) for JavaScript errors
4. Check backend terminal for server errors
5. Verify all files are in the correct folder structure

Good luck with your presentation! 🎓✨
