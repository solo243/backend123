const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    startTime: { type: Date, default: null }, // Stores start time as a Date object
    remainingTime: { type: Number, default: null }, // Remaining time in seconds
    isPaused: { type: Boolean, default: false }, // Timer paused or not
}, { timestamps: true });

const Timer = mongoose.model('Timer', timerSchema);

module.exports = Timer;
