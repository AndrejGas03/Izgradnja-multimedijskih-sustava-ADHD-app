# 🚀 INSTALLATION & VERIFICATION GUIDE

**Complete step-by-step guide to get your app running**

---

## ⏱️ Total Time Required: 5-10 Minutes

---

## 📋 Pre-Installation Checklist

Before you start, verify you have:
- [ ] Node.js installed (version 14 or higher)
- [ ] npm installed (comes with Node.js)
- [ ] Internet connection
- [ ] Terminal/Command Prompt open
- [ ] Text editor (VS Code recommended)

**Check Node.js version:**
```bash
node --version
# Should output: v14.0.0 or higher

npm --version
# Should output: 6.0.0 or higher
```

If Node.js is not installed, download from: https://nodejs.org

---

## 🔧 Installation Steps

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

**What you should see:**
- Prompt changes to show `backend` directory
- Files visible: `server.js`, `package.json`, `data.json`

### Step 2: Install Dependencies
```bash
npm install
```

**What will happen:**
- npm will read `package.json`
- Download and install: `express`, `cors`, `body-parser`
- Creates `node_modules` folder (~50MB)
- Creates `package-lock.json`

**Expected time:** 30-60 seconds

**Expected output:**
```
added 50 packages in 45s
```

### Step 3: Start the Backend Server
```bash
npm start
```

**Expected output:**
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

**If you see this message, backend is running ✅**

---

## 📱 Opening the Frontend

### Step 4: Open Web Browser
1. Open your favorite web browser (Chrome, Firefox, Safari, Edge)
2. Navigate to: **http://localhost:5000**
3. Press Enter

**Expected page:**
- Cream-colored background (#f5f3e9)
- Green connection status: "✅ Connected to server"
- Title: "🎮 Learning Games"
- Three game buttons visible
- Speaker button (🔊)
- Difficulty selector (Easy/Hard)

---

## ✅ Verification Checklist

### Visual Verification (in Browser)

- [ ] Page loads without errors
- [ ] Background is cream color (not white)
- [ ] Text is dark blue (not black)
- [ ] Connection status shows GREEN ✅
- [ ] 5 stars visible at top (gray/unfilled)
- [ ] Title text is large and clear
- [ ] 3 game buttons are visible and large
- [ ] Speaker button (orange circle with 🔊)
- [ ] Difficulty selector shows "Easy" and "Hard" options
- [ ] All text is readable (not too small)

### Functional Verification

**1. Test Connection Status**
- [ ] Green status appears on page load
- [ ] Status text reads "✅ Connected to server"

**2. Test Speaker Button**
- [ ] Click the orange speaker button 🔊
- [ ] You should hear instructions (if audio is enabled)
- [ ] Text is spoken slowly and clearly

**3. Test Difficulty Selector**
- [ ] Click "Easy" radio button → selected
- [ ] Click "Hard" radio button → selected
- [ ] Switch back to "Easy"

**4. Test Game 1 - Slova**
- [ ] Click "🔤 Game 1: Letter Sounds"
- [ ] See image emoji (e.g., 🍎)
- [ ] See 3 letter buttons (e.g., A, P, M)
- [ ] Click correct letter (A for Apple)
- [ ] See green screen flash
- [ ] Hear success sound (ascending tones)
- [ ] Star appears in progress bar
- [ ] Next word appears automatically

**5. Test Game 2 - Memorija**
- [ ] Go back to home (click "Back to Home")
- [ ] Click "🎨 Game 2: Memory Colors"
- [ ] Watch 2 colored squares flash
- [ ] Each flash makes a different sound
- [ ] Click the squares in same order
- [ ] Correct sequence shows green flash
- [ ] Another star appears in progress bar

**6. Test Game 3 - Reakcija**
- [ ] Go back to home
- [ ] Click "⚡ Game 3: Quick Click"
- [ ] See star (⭐) appear on screen
- [ ] Click it as fast as possible
- [ ] See reaction time displayed (e.g., "152ms")
- [ ] Another star appears in progress bar

**7. Test Final Screen**
- [ ] After completing a game, see final screen
- [ ] Shows "BRAVO! 🎊" message
- [ ] Shows stars earned (⭐ symbols)
- [ ] Shows total stars from backend
- [ ] Click "Play Again" → resets to home with stars retained

**8. Test Data Persistence**
- [ ] Note the total stars shown
- [ ] Refresh page (F5 or Cmd+R)
- [ ] Total stars should remain the same
- [ ] Connection should still show ✅

---

## 🔌 API Verification (Optional)

Open another terminal/command prompt and test endpoints:

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "ADHD Educational App Backend is running",
  "timestamp": "2026-05-06T14:30:00.000Z"
}
```

### Test 2: Get All Games
```bash
curl http://localhost:5000/api/games
```

**Expected response:**
```json
{
  "success": true,
  "games": [
    {
      "id": "game1",
      "name": "Slova",
      "description": "Find the starting letter",
      "emoji": "🔤"
    },
    ...
  ]
}
```

### Test 3: Get Total Stars
```bash
curl http://localhost:5000/api/stars
```

**Expected response:**
```json
{
  "success": true,
  "totalStars": 0,
  "sessionCount": 0
}
```

### Test 4: Get Game Data
```bash
curl http://localhost:5000/api/game/game1/easy
```

**Expected response:**
```json
{
  "success": true,
  "game": "game1",
  "words": [
    {
      "word": "Apple",
      "emoji": "🍎",
      "correct": "A",
      "options": ["A", "P", "M"]
    },
    ...
  ]
}
```

### Test 5: Add Stars
```bash
curl -X POST http://localhost:5000/api/stars \
  -H "Content-Type: application/json" \
  -d "{\"starsEarned\": 3, \"gameId\": \"game1\"}"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Added 3 stars",
  "newTotal": 3,
  "sessionCount": 1
}
```

---

## 🔄 Data Verification

### Check data.json File

**Location:** `backend/data.json`

**After playing games, should look like:**
```json
{
  "totalStars": 3,
  "sessionCount": 1,
  "lastUpdated": "2026-05-06T14:30:00.000Z"
}
```

**If file is empty or has errors:**
```bash
# From backend folder:
curl http://localhost:5000/api/reset
```

---

## ❌ Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js not installed
```bash
# Check installation
node --version
# If error, download from https://nodejs.org
```

### Problem: "Port 5000 already in use"
**Solution:** Use different port
```bash
PORT=3000 npm start
# Then access: http://localhost:3000
```

### Problem: Frontend shows "❌ Server connection failed"
**Solution:** Backend not running
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Wait 2 seconds, then open http://localhost:5000
```

### Problem: "Cannot find module 'express'"
**Solution:** Didn't run npm install
```bash
cd backend
npm install
```

### Problem: Stars not persisting
**Solution:** Check write permissions
```bash
# Check if data.json exists and is readable
cat backend/data.json
# or on Windows:
type backend/data.json
```

### Problem: Frontend won't load styling or JavaScript
**Solution:** Clear browser cache
```
Windows/Linux: Ctrl+Shift+Delete
Mac: Cmd+Shift+Delete
# Then reload page: Ctrl+R or Cmd+R
```

### Problem: Games won't start
**Solution:** Check browser console for errors
```
Press F12 to open Developer Tools
Go to "Console" tab
Look for red error messages
Share error message for debugging
```

---

## 🎮 Ready for Demo?

Before your presentation, verify:

**Checklist:**
- [ ] Backend starts without errors
- [ ] Frontend loads and shows connection ✅
- [ ] All 3 games are playable
- [ ] Stars accumulate and display correctly
- [ ] Data persists on page refresh
- [ ] Speaker button works (test audio)
- [ ] Visual feedback works (green/red flashes)
- [ ] Audio feedback works (beep sounds)

**Reset for clean demo:**
```bash
curl http://localhost:5000/api/reset
# Response: totalStars should be 0
```

---

## 📱 Testing on Different Devices

### Same Computer
✅ Works as described above

### Another Computer on Same Network
```bash
# Get your computer's IP:
# Windows: ipconfig
# Mac/Linux: ifconfig

# Look for IPv4 Address, e.g., 192.168.1.100

# On other computer, use:
http://192.168.1.100:5000
```

### Mobile Device (iPhone, Android)
```bash
# Same as above - use your computer's IP address
http://192.168.1.100:5000
```

---

## 🎓 What if Something Goes Wrong?

### Keep Trying! Here's the Priority:

1. **Backend runs on port 5000** (most important)
   - Without this, nothing else works

2. **Frontend loads and shows connection ✅**
   - If you see green checkmark, backend is working

3. **One game works**
   - If one game works, architecture is correct

4. **All features working perfectly**
   - This is the final goal, but not blocking

### How to Debug:

**Terminal 1 (Backend):**
- Watch for errors when backend starts
- Watch for errors when frontend makes API calls
- Note any red error messages

**Terminal 2 (Browser Console):**
- Open DevTools: Press F12
- Go to "Console" tab (not "Elements" or "Network")
- Look for red error messages
- Click on errors to see details

**Common Errors & Fixes:**
- `Failed to fetch`: Backend not running
- `port already in use`: Use PORT=3000 npm start
- `Cannot read property 'length'`: Refresh page
- `undefined is not a function`: Clear cache (Ctrl+Shift+Delete)

---

## ✨ Success!

When everything is working correctly:
- ✅ Backend server running on http://localhost:5000
- ✅ Frontend loads with cream background
- ✅ Green "Connected to server" indicator
- ✅ All 3 games playable
- ✅ Stars display and persist
- ✅ Audio and visual feedback working

**You're ready for your presentation!**

---

## 📞 Need Help?

### Quick Reference Files:
- `README.md` - Architecture overview
- `SETUP.md` - Installation guide
- `DEFENSE.md` - Presentation tips
- `QUICK_REFERENCE.md` - Demo cheat sheet

### Check These First:
1. Is backend running? (Terminal shows "Running on...")
2. Is frontend connected? (Green ✅ indicator)
3. Is data.json readable? (Check backend/data.json)
4. Are all files in correct folders? (Check folder structure)

### Last Resort:
1. Close everything (browsers, terminals)
2. Delete `backend/node_modules` folder
3. Start fresh: `npm install` → `npm start`
4. Open browser fresh: http://localhost:5000

---

## 🎯 Final Verification Before Defense

**30 minutes before:**
```bash
# Terminal 1: Start backend fresh
cd backend
rm -rf node_modules          # Clean
npm install                  # Fresh install
npm start                    # Start server

# Terminal 2: Test in browser
# Navigate to http://localhost:5000
# Play through each game
# Verify stars save and persist

# Reset data for demo
curl http://localhost:5000/api/reset
```

**5 minutes before:**
- Backend terminal showing "Running on..."
- Browser showing "✅ Connected"
- Ready to demo!

---

**You've got this! 🚀**

If you encounter any issues:
1. Don't panic (technical issues happen)
2. Show the code in your editor (proves you built it)
3. Explain the logic verbally
4. Try resetting backend and refreshing browser
5. Move on with confidence

Good luck! ✨
