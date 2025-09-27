const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scoreRoutes = require('./routes/scoreRoutes');

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route to check server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/scores', scoreRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
