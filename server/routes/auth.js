const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here"; // fallback secret for dev

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, mobile, password } = req.body;

  try {
    // Check if email or mobile already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }]
    });
    if (existingUser) {
      return res.status(400).json({ msg: "Email or mobile already registered" });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, mobile, password: hashedPass });
    await user.save();

    res.json({ msg: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ msg: "Duplicate field error", error: err.keyValue });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, mobile, password } = req.body;

  if ((!email && !mobile) || !password) {
    return res.status(400).json({ msg: "Email or mobile and password are required" });
  }

  try {
    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token (expires in 1 day)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        username: user.username,
        highScore: user.highScore,
        id: user._id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
