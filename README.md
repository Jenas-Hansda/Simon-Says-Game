# 🟢 Simon Says Game — MERN Stack

This is a full-stack web implementation of the classic **Simon Says** memory game built using the **MERN stack** (MongoDB, Express, React, Node.js).

🧠 The game challenges users to memorize and repeat an increasingly complex sequence of button presses. It tracks:

- ✅ User's current score
- 🏆 Highest score (stored in MongoDB)

---

## 🚀 Tech Stack

| Layer        | Technology            |
|--------------|------------------------|
| Frontend     | React, CSS             |
| Backend      | Node.js, Express       |
| Database     | MongoDB (via Mongoose) |
| API Handling | Axios                  |
| Dev Tools    | Nodemon, Concurrently  |

---

## 🎮 How to Play

1. Press any key to start.
2. Watch the sequence of button flashes.
3. Repeat the sequence in the correct order.
4. Each correct round adds a new button to the sequence.
5. Game ends if you click the wrong button.

---

## 📦 Local Setup

```bash
git clone https://github.com/Jenas-Hansda/Simon-Says-Game.git
cd simon-mern
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Start both frontend and backend
npm run dev
