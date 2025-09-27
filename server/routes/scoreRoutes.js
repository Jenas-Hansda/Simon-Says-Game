const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// GET highest score
router.get('/highscore', async (req, res) => {
    try {
        const highScore = await Score.findOne().sort({ value: -1 }).limit(1);
        res.json(highScore || { value: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new score
router.post('/', async (req, res) => {
    try {
        const newScore = new Score({ value: req.body.value });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
