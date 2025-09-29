const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

// Health Check Route (optional)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy ✅" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    app.listen(5000, () =>
      console.log("🚀 Server is running on http://localhost:5000")
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
