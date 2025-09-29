import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "../api/axios";
import Scoreboard from "../components/Scoreboard";

const colors = ["red", "blue", "green", "purple"];

const Game = () => {
  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [level, setLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("Click Start to begin the Game");
  const [highScore, setHighScore] = useState(0);

  const { user, token } = useContext(AuthContext);

  // ✅ Fetch High Score (guest or user)
  const fetchHighScore = useCallback(async () => {
    try {
      if (token) {
        const res = await axios.get("/score/user", {
          headers: { Authorization: token },
        });
        setHighScore(res.data.highScore || 0);
      } else {
        const res = await axios.get("/score/guest-highscore");
        setHighScore(res.data.value || 0);
      }
    } catch (err) {
      console.error("Error fetching high score:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchHighScore();
  }, [fetchHighScore]);

  // ✅ Save High Score to backend
  const saveHighScore = useCallback(
    async (score) => {
      try {
        if (token) {
          await axios.post(
            "/score/update",
            { score },
            { headers: { Authorization: token } }
          );
        } else {
          await axios.post("/score/guest", { value: score });
        }
        fetchHighScore();
      } catch (err) {
        console.error("Error saving high score:", err);
      }
    },
    [token, fetchHighScore]
  );

  const flashButton = (color, className) => {
    const btn = document.getElementById(color);
    if (!btn) return;
    btn.classList.add(className);
    setTimeout(() => btn.classList.remove(className), 200);
  };

  const nextLevel = useCallback(() => {
    setUserSeq([]);
    setLevel((prev) => {
      const newLevel = prev + 1;
      setStatus(`Level ${newLevel}`);
      return newLevel;
    });

    const nextColor = colors[Math.floor(Math.random() * 4)];
    setGameSeq((prev) => [...prev, nextColor]);
    setTimeout(() => flashButton(nextColor, "flash"), 500);
  }, []);

  const checkAnswer = useCallback(
    (index) => {
      if (userSeq[index] !== gameSeq[index]) {
        const finalScore = level - 1;
        setStatus(`❌ Game Over! Your Score: ${finalScore}. Click Start to try again.`);
        document.body.style.backgroundColor = "red";
        setTimeout(() => (document.body.style.backgroundColor = "white"), 200);

        if (finalScore > highScore) {
          saveHighScore(finalScore);
        }

        setStarted(false);
        setGameSeq([]);
        setUserSeq([]);
        setLevel(0);
      } else if (userSeq.length === gameSeq.length) {
        setTimeout(() => nextLevel(), 1000);
      }
    },
    [userSeq, gameSeq, level, highScore, saveHighScore, nextLevel]
  );

  useEffect(() => {
    if (userSeq.length > 0) {
      checkAnswer(userSeq.length - 1);
    }
  }, [userSeq, checkAnswer]);

  const handleClick = (color) => {
    if (!started) return;
    flashButton(color, "userflash");
    setUserSeq((prev) => [...prev, color]);
  };

  const startGame = () => {
    setStarted(true);
    setGameSeq([]);
    setUserSeq([]);
    setLevel(0);
    setStatus("Starting...");
    setTimeout(() => nextLevel(), 500);
  };

  return (
    <>
      <div className="score-section">
        <h1>Simon Says Game</h1>

        {/* 🔝 High Score */}
        <h2>🏆 High Score: {highScore}</h2>

        {/* 👤 User Info */}
        {user ? (
          <div>
            <h3>👤 Player: {user.username}</h3>
            <h3>🎯 Your Personal Best: {user.highScore}</h3>
          </div>
        ) : (
          <h3 className="level">👤 Guest Mode</h3>
        )}

        {/* Status message */}
        <h3 className="level">{status}</h3>

        {/* Current Score */}
        <h3>🕹️ Current Score: {level === 0 ? 0 : level - 1}</h3>

        {/* Start button */}
        {!started && (
          <button onClick={startGame} className="start-btn">
            ▶️ Start Game
          </button>
        )}

        {/* Game Buttons */}
        <div className="btn-container">
          <div className="line-0ne">
            <div className="btn red" id="red" onClick={() => handleClick("red")} />
            <div className="btn green" id="green" onClick={() => handleClick("green")} />
          </div>
          <div className="line-two">
            <div className="btn blue" id="blue" onClick={() => handleClick("blue")} />
            <div className="btn purple" id="purple" onClick={() => handleClick("purple")} />
          </div>
        </div>

        {/* Scoreboard */}
        <Scoreboard />
      </div>

      {/* 📘 Game Instructions */}
      <div className="instructions">
        <h2>📘 How to Play Simon Says</h2>
        <ol>
          <li><strong>Click ▶️ Start Game</strong> to begin.</li>
          <li>The game will flash one button (e.g., 🔴 red).</li>
          <li>Click the same color button to repeat the sequence.</li>
          <li>Each new level adds another color to the sequence.</li>
          <li>Keep repeating the growing sequence correctly to level up.</li>
          <li>If you click the wrong color, the game ends.</li>
          <li>Your current score is the number of completed levels.</li>
          <li>
            If your score is higher than your previous best, it will be saved 
            <span> {user ? " to your account." : " as a guest high score."}</span>
          </li>
        </ol>
        <p><strong>Tip:</strong> Watch the flashing pattern carefully and click in the same order. The longer you last, the higher your score!</p>
        <p><strong>Goal:</strong> Beat your own high score or challenge friends!</p>
      </div>
    </>
  );
};

export default Game;
