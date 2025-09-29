const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

// Update score
router.post("/update", auth, async (req, res) => {
  const { score } = req.body;
  if (score > req.user.highScore) {
    req.user.highScore = score;
    await req.user.save();
  }
  res.json({ msg: "Score updated", highScore: req.user.highScore });
});

// Get scoreboard
router.get("/board", async (req, res) => {
  const topUsers = await User.find().sort({ highScore: -1 }).limit(10).select("username highScore");
  res.json(topUsers);
});

module.exports = router;
