const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, mobile, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const hashedPass = await bcrypt.hash(password, 10);
  const user = new User({ username, email, mobile, password: hashedPass });

  await user.save();
  res.json({ msg: "Signup successful" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, mobile, password } = req.body;

  if ((!email && !mobile) || !password) {
    return res.status(400).json({ msg: "Email or mobile and password are required" });
  }

  // Find by email or mobile
  const user = await User.findOne({
    $or: [{ email }, { mobile }]
  });

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({
    token,
    user: {
      username: user.username,
      highScore: user.highScore,
      id: user._id
    }
  });
});


module.exports = router;
