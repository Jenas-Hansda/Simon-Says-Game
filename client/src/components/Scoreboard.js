import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Scoreboard = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    axios.get("/score/board").then((res) => setBoard(res.data));
  }, []);

  return (
    <div>
      <h2>Top 10 Players</h2>
      <ul>
        {board.map((p, i) => (
          <li key={i}>{p.username} - {p.highScore}</li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
