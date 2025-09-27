import React, { useEffect, useState, useCallback } from "react";
import API from "./api"; // ✅ Use centralized axios instance

const btnColors = ["red", "blue", "green", "purple"];

export default function SimonGame() {
  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [level, setLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState("Click Start to begin the Game");

  // ✅ Fetch high score from backend on mount
  const fetchHighScore = useCallback(async () => {
    try {
      const res = await API.get("/api/scores/highscore");
      setHighScore(res.data.value);
    } catch (err) {
      console.error("Error fetching high score", err);
    }
  }, []);

  useEffect(() => {
    fetchHighScore();
  }, [fetchHighScore]);

  // ✅ Save new high score to backend
  const saveHighScore = useCallback(
    async (score) => {
      try {
        await API.post("/api/scores", { value: score });
        fetchHighScore();
      } catch (err) {
        console.error("Error saving score", err);
      }
    },
    [fetchHighScore]
  );

  // ✅ Flash a button during game sequence
  const flashButton = (color) => {
    const btn = document.getElementById(color);
    if (!btn) return;
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 200);
  };

  // ✅ Flash a button on user click
  const flashUserButton = (color) => {
    const btn = document.getElementById(color);
    if (!btn) return;
    btn.classList.add("userflash");
    setTimeout(() => btn.classList.remove("userflash"), 200);
  };

  // ✅ Generate next level and update game sequence
  const nextLevel = useCallback(() => {
    setGameSeq((prevSeq) => {
      const randColor = btnColors[Math.floor(Math.random() * 4)];
      const newSeq = [...prevSeq, randColor];
      setUserSeq([]);
      setLevel(newSeq.length);
      setStatus(`Level ${newSeq.length}`);
      setTimeout(() => flashButton(randColor), 500);
      return newSeq;
    });
  }, []);

  // ✅ Reset game state
  const resetGame = useCallback(() => {
    setStarted(false);
    setGameSeq([]);
    setUserSeq([]);
    setLevel(0);
  }, []);

  // ✅ Check user input against game sequence
  const checkAnswer = useCallback(
    (index) => {
      if (userSeq[index] !== gameSeq[index]) {
        setStatus(
          `Game Over! Your Score: ${level === 0 ? 0 : level - 1}. Click Start to Restart.`
        );
        document.body.style.backgroundColor = "red";
        setTimeout(() => {
          document.body.style.backgroundColor = "white";
        }, 200);

        if (level - 1 > highScore) {
          saveHighScore(level - 1);
        }

        resetGame();
        return;
      }

      if (userSeq.length === gameSeq.length) {
        setTimeout(() => nextLevel(), 1000);
      }
    },
    [userSeq, gameSeq, level, highScore, saveHighScore, resetGame, nextLevel]
  );

  // ✅ Trigger check after every user click
  useEffect(() => {
    if (userSeq.length && userSeq.length <= gameSeq.length) {
      checkAnswer(userSeq.length - 1);
    }
  }, [userSeq, gameSeq.length, checkAnswer]);

  // ✅ Handle user clicking a button
  const handleBtnClick = (color) => {
    if (!started) return;
    flashUserButton(color);
    setUserSeq((prev) => [...prev, color]);
  };

  return (
    <div>
      <h1>Simon Says Game</h1>

      <h2 className="highScore">High Score: {highScore}</h2>
      <h2 className="userScore">Your Score: {level === 0 ? 0 : level - 1}</h2>
      <h2 className="level">{status}</h2>

      {!started && (
        <button
          onClick={() => {
            setStarted(true);
            nextLevel();
          }}
          className="start-btn"
        >
          Start Game
        </button>
      )}

      <div className="btn-container">
        <div className="line-0ne">
          <div
            className="btn red"
            id="red"
            aria-label="Red button"
            onClick={() => handleBtnClick("red")}
          ></div>
          <div
            className="btn green"
            id="green"
            aria-label="Green button"
            onClick={() => handleBtnClick("green")}
          ></div>
        </div>
        <div className="line-two">
          <div
            className="btn blue"
            id="blue"
            aria-label="Blue button"
            onClick={() => handleBtnClick("blue")}
          ></div>
          <div
            className="btn purple"
            id="purple"
            aria-label="Purple button"
            onClick={() => handleBtnClick("purple")}
          ></div>
        </div>
      </div>
    </div>
  );
}
