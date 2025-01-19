// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb+srv://admin:admin123@cluster.di249.mongodb.net/')
//     .then(() => {
//         console.log('MongoDB connected');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });

// const timerSchema = new mongoose.Schema({
//     endTime: Date,
//     status: String,
//     pausedTimeLeft: {
//         hours: Number,
//         minutes: Number,
//         seconds: Number
//     },
//     createdAt: { type: Date, default: Date.now }
// });

// const Timer = mongoose.model('Timer', timerSchema);

// app.get('/api/timer/current', async (req, res) => {
//     try {
//         const timer = await Timer.findOne().sort({ createdAt: -1 });
//         res.json({
//             ...timer?._doc,
//             serverTime: new Date(),
//             status: timer?.status || 'idle'
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.post('/api/timer/start', async (req, res) => {
//     try {
//         const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
//         const timer = new Timer({
//             endTime,
//             status: 'running',
//             pausedTimeLeft: null
//         });
//         await timer.save();
//         res.json({
//             ...timer._doc,
//             serverTime: new Date()
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.post('/api/timer/pause', async (req, res) => {
//     try {
//         const timer = await Timer.findOne().sort({ createdAt: -1 });
//         if (timer) {
//             timer.status = 'paused';
//             timer.pausedTimeLeft = req.body.timeLeft;
//             await timer.save();
//         }
//         res.json({
//             ...timer._doc,
//             serverTime: new Date()
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.post('/api/timer/resume', async (req, res) => {
//     try {
//         const timer = await Timer.findOne().sort({ createdAt: -1 });
//         if (timer && timer.pausedTimeLeft) {
//             const totalMilliseconds =
//                 (timer.pausedTimeLeft.hours * 60 * 60 * 1000) +
//                 (timer.pausedTimeLeft.minutes * 60 * 1000) +
//                 (timer.pausedTimeLeft.seconds * 1000);

//             timer.endTime = new Date(Date.now() + totalMilliseconds);
//             timer.status = 'running';
//             timer.pausedTimeLeft = null;
//             await timer.save();
//         }
//         res.json({
//             ...timer._doc,
//             serverTime: new Date()
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.post('/api/timer/reset', async (req, res) => {
//     try {
//         const timer = await Timer.findOne().sort({ createdAt: -1 });
//         if (timer) {
//             timer.status = 'idle';
//             timer.endTime = null;
//             timer.pausedTimeLeft = null;
//             await timer.save();
//         }
//         res.json({
//             status: 'idle',
//             serverTime: new Date()
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set up the app
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin123@cluster.di249.mongodb.net/')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


// Create the Timer schema and model
const timerSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
});

const Timer = mongoose.model('Timer', timerSchema);

// API to start the timer
app.post('/api/start', async (req, res) => {
    const currentTime = new Date();
    const newTimer = new Timer({ startTime: currentTime });
    await newTimer.save();
    res.json({ startTime: currentTime });
});

// API to get the current timer
app.get('/api/timer', async (req, res) => {
    const timer = await Timer.findOne().sort({ _id: -1 }); // Get the latest timer
    if (timer) {
        res.json({ startTime: timer.startTime });
    } else {
        res.status(404).json({ message: 'Timer not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
