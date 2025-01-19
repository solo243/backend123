const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let startTime = null;
let remainingTime = null;
let isPaused = false;

app.get('/start-time', (req, res) => {
    if (startTime || isPaused) {
        console.log(res.json({ startTime, remainingTime, isPaused }))

        res.json({ startTime, remainingTime, isPaused });
    } else {
        console.log(res.status(404).json({ message: 'Countdown not started yet.' }))

        res.status(404).json({ message: 'Countdown not started yet.' });
    }
});

// Endpoint to start or resume the countdown
app.post('/start-time', (req, res) => {
    if (isPaused && remainingTime !== null) {
        // Resume countdown
        startTime = Date.now() - (24 * 60 * 60 * 1000 - remainingTime * 1000);
        isPaused = false;
        remainingTime = null;
        console.log(res.status(200).json({ message: 'Countdown resumed!', startTime }))

        res.status(200).json({ message: 'Countdown resumed!', startTime });
    } else if (!startTime) {
        // Start new countdown
        startTime = Date.now();
        isPaused = false;
        remainingTime = null;
        console.log(res.status(201).json({ message: 'Countdown started!', startTime }))

        res.status(201).json({ message: 'Countdown started!', startTime });
    } else {
        res.status(400).json({ message: 'Countdown already started!' });
    }
});

// Endpoint to pause the countdown
app.post('/pause-time', (req, res) => {
    if (!isPaused && startTime) {
        remainingTime = Math.max(
            24 * 60 * 60 - Math.floor((Date.now() - startTime) / 1000),
            0
        );
        isPaused = true;
        startTime = null; // Clear startTime since it's paused
        console.log(res.status(200).json({ message: 'Countdown paused!', remainingTime }));
        res.status(200).json({ message: 'Countdown paused!', remainingTime });
    } else {
        console.log(res.status(400).json({ message: 'Countdown is not running!' }))
        res.status(400).json({ message: 'Countdown is not running!' });
    }
});

// Endpoint to reset the countdown
app.delete('/start-time', (req, res) => {
    startTime = null;
    remainingTime = null;
    isPaused = false;
    res.status(200).json({ message: 'Countdown reset!' });
});

app.get('/', (req, res) => {
    res.json("working.....")
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
