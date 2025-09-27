const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scoreRoutes = require('./routes/scoreRoutes');

require('dotenv').config({ path: __dirname + '/.env' });

// console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/scores', scoreRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch(err => console.error(err));
