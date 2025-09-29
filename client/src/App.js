import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
