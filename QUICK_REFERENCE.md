# Quick Reference Card

Use this during your presentation!

---

## 🎯 Project Summary (30 seconds)

**Full-Stack Educational App for Children with ADHD and Dyslexia**
- Backend: Node.js + Express (350 lines)
- Frontend: Vanilla JS, HTML, CSS (1,350 lines)
- 3 Interactive Games + Star Tracking System
- Professional REST API Architecture
- Data Persistence via JSON Database

---

## 🏗️ Architecture (Show Diagram)

```
Browser (Frontend) ←→ Express API ←→ JSON Database
```

**Key Files:**
- `backend/server.js` - Express server with 6 API endpoints
- `frontend/script.js` - Game logic & API calls
- `frontend/style.css` - ADHD-friendly styling
- `backend/data.json` - Star persistence

---

## 🎮 The 3 Games

| Game | Mechanics | Skills | Easy | Hard |
|------|-----------|--------|------|------|
| **Slova** | Click letter button | Reading | 5 words | 5 words |
| **Memorija** | Repeat color sequence | Memory | 2-color | 3-color |
| **Reakcija** | Click star quickly | Reaction | 3s delay | 2s delay |

---

## 🌟 Star System

**Per Session:** 0-5 stars (1 per game)
**Persistence:** Saved to backend via POST /api/stars
**Display:** 
- Progress bar at top (visual feedback)
- Final screen shows session + total
- Total stored in `backend/data.json`

---

## 🔌 Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check backend online |
| `/api/games` | GET | List all games |
| `/api/game/:id/:diff` | GET | Get game data |
| `/api/stars` | GET | Get total stars |
| `/api/stars` | POST | Save stars earned |
| `/api/reset` | GET | Reset data (testing) |

---

## 🎨 ADHD/Dyslexia Principles

✅ **Minimalism** - One task per screen, zero clutter
✅ **High Contrast** - Dark blue (#1a3a52) on cream (#f5f3e9)
✅ **Large Typography** - 18px minimum, 36-48px headings
✅ **Web Speech API** - Instructions read aloud at 0.9x speed
✅ **Immediate Feedback** - Green flash + success sound
✅ **Clear Buttons** - 120x120px, large touch targets
✅ **No Animations** - Only visual feedback, no distractions

---

## 🔊 Accessibility Features

| Feature | Implementation |
|---------|-----------------|
| Audio | Web Speech API reads instructions |
| Visual Feedback | Green flash (correct), Red flash (error) |
| Sound Effects | C-E-G tones (success), A-E tones (error) |
| Color Tones | Game 2 has audio for each color |
| Progress Bars | Stars animate and fill |
| Reaction Times | Game 3 displays ms clicked |

---

## 📊 Data Flow

```
1. User starts app
2. Frontend checks /health (backend online?)
3. Fetch /api/games (list games)
4. User clicks game + difficulty
5. Fetch /api/game/{id}/{difficulty} (game data)
6. Play game
7. For each correct: addStar() + showVisualFeedback()
8. Game ends
9. POST /api/stars {starsEarned, gameId}
10. Fetch /api/stars (get new total)
11. Show final screen with total
```

---

## 💻 Setup (3 minutes)

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm start
# ✅ Should show: "Running on http://localhost:5000"

# Terminal 2: Open Frontend
# Browser → http://localhost:5000
# ✅ Should show: "✅ Connected to server"
```

---

## 🎮 Demo Script (8 minutes)

**Minute 0-1: Home Screen**
- Show connection status ✅
- Show difficulty selector
- Click speaker button
- Explain 3 games

**Minute 1-3: Game 1 - Slova**
- "Look at image, click starting letter"
- Correctly click → Green + sound
- Wrong click → Red + sound
- 5 words = complete

**Minute 3-5: Game 2 - Memorija**
- "Watch colors flash"
- Click in same order
- Success → advance to final screen

**Minute 5-7: Game 3 - Reakcija**
- "Click star fast!"
- Show reaction time
- 3 attempts

**Minute 7-8: Final Screen**
- Show bravo message
- Show stars earned
- Show total stars
- Click "Play Again" (session resets, total stays)

---

## ❌ If Things Break

**Backend won't start:**
```bash
# Check if port 5000 is free
# Try different port:
PORT=3000 npm start
```

**Frontend won't connect:**
- Check backend is running
- Clear browser cache (Ctrl+Shift+Delete)
- F12 → Console → Look for errors

**Stars not saving:**
- Check `backend/data.json` exists
- Check backend terminal for errors
- Reset: `curl http://localhost:5000/api/reset`

---

## 🎓 Key Talking Points

1. **"This is a FULL-STACK application"**
   - Show backend + frontend separately
   - Explain separation of concerns

2. **"Data persists across sessions"**
   - Play game, earn stars
   - Refresh page → stars still there
   - Check data.json in backend folder

3. **"Designed for ADHD & Dyslexia"**
   - Minimalist (no clutter)
   - High contrast (easy to read)
   - Large fonts (accessible)
   - Web Speech (audio + text)

4. **"Professional architecture"**
   - REST API design
   - Scalable to database
   - Extensible to mobile
   - Well-documented code

5. **"1,700 lines of production-quality code"**
   - Backend: 350 lines
   - Frontend: 1,350 lines
   - All well-commented
   - Ready for expansion

---

## ⏱️ Timing

- **Architecture**: 3 minutes (explain diagram)
- **Design Principles**: 2 minutes (show examples)
- **Live Demo**: 8 minutes (play all 3 games)
- **Code Walkthrough**: 7 minutes (show key files)
- **Q&A**: 10 minutes (answer confidently)
- **Total**: 30 minutes

---

## 📱 Testing Checklist

Before you present, verify:
- [ ] Backend starts without errors
- [ ] Frontend loads and shows connection
- [ ] Game 1 playable (at least 1 word)
- [ ] Game 2 playable (sequence works)
- [ ] Game 3 playable (star appears)
- [ ] Final screen shows stars
- [ ] Connection status indicator works
- [ ] Star counter at top updates
- [ ] Speaker button works (if audio enabled)

---

## 🎤 Opening Line

> "I've built a full-stack educational application specifically designed for children with ADHD and dyslexia. It features three interactive games, a professional Node.js backend API, and a minimalist, accessible interface. The architecture separates frontend and backend concerns, allowing for data persistence and future scaling to mobile platforms. Let me walk you through how it works."

---

## 🎤 Closing Line

> "This project demonstrates how technology can be compassionately designed for children with specific needs. By combining evidence-based design principles with professional software architecture, we create tools that are both immediately useful and built for long-term growth."

---

## 📚 Files to Have Ready

- [ ] `README.md` - Main documentation
- [ ] `ARCHITECTURE.md` - Technical details
- [ ] `DEFENSE.md` - Full presentation guide
- [ ] `SETUP.md` - Installation steps
- [ ] All code files open in VS Code
- [ ] Backend terminal running
- [ ] Browser with app loaded
- [ ] Screenshots as backup

---

## 🔄 Quick Demo Reset

Before each presentation:
```bash
# Reset data to 0 stars
curl http://localhost:5000/api/reset

# Verify:
curl http://localhost:5000/api/stars
# Should show: {"success": true, "totalStars": 0}
```

---

## 💡 If Asked About Specific Code

**"How does the API work?"**
→ Show `/api/game/:gameId/:difficulty` endpoint in server.js

**"How is data saved?"**
→ Show POST `/api/stars` endpoint and `saveData()` function

**"Why vanilla JavaScript?"**
→ "No framework overhead, full control, demonstrates fundamentals"

**"Why separate files?"**
→ "Professional practice, maintainability, separate styling/logic"

**"Can it scale?"**
→ "Yes! Currently JSON, but designed for database migration"

---

**Last Minute Reminder:**
✨ You built this. You understand every line.
✨ You can explain it confidently.
✨ Your evaluators will be impressed.
✨ Go show them what you've created!

Good luck! 🚀
