const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');
const Timer = require('./time.schema');

// Replace with your MongoDB URI
const MONGODB_URI = 'mongodb+srv://admin:admin123@cluster.di249.mongodb.net/';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


let startTime = null;
let remainingTime = null;
let isPaused = false;


// Get the timer state
app.get('/start-time', async (req, res) => {
    try {
        const timer = await Timer.findOne();
        if (!timer) {
            return res.status(404).json({ message: 'Countdown not started yet.' });
        }
        res.json(timer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching timer state.' });
    }
});

// Start or resume the countdown
app.post('/start-time', async (req, res) => {
    try {
        let timer = await Timer.findOne();

        if (timer?.isPaused && timer.remainingTime !== null) {
            // Resume countdown
            timer.startTime = new Date(Date.now() - (24 * 60 * 60 * 1000 - timer.remainingTime * 1000));
            timer.isPaused = false;
            timer.remainingTime = null;
        } else if (!timer) {
            // Start new countdown
            timer = new Timer({ startTime: new Date(), isPaused: false });
        } else {
            return res.status(400).json({ message: 'Countdown already started!' });
        }

        await timer.save();
        res.status(200).json({ message: 'Countdown started/resumed!', timer });
    } catch (error) {
        res.status(500).json({ message: 'Error starting countdown.' });
    }
});

// Pause the countdown
app.post('/pause-time', async (req, res) => {
    try {
        const timer = await Timer.findOne();
        if (timer && !timer.isPaused && timer.startTime) {
            timer.remainingTime = Math.max(
                24 * 60 * 60 - Math.floor((Date.now() - new Date(timer.startTime).getTime()) / 1000),
                0
            );
            timer.isPaused = true;
            timer.startTime = null; // Clear startTime since it's paused
            await timer.save();
            res.status(200).json({ message: 'Countdown paused!', timer });
        } else {
            res.status(400).json({ message: 'Countdown is not running!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error pausing countdown.' });
    }
});

// Reset the countdown
app.delete('/start-time', async (req, res) => {
    try {
        await Timer.deleteMany(); // Clear all timer states
        res.status(200).json({ message: 'Countdown reset!' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting timer.' });
    }
});


app.get('/', (req, res) => {
    res.json("working.....")
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
