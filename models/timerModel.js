const mongoose = require('mongoose');

const timerSchema = mongoose.Schema({
    penaltyTimer: {
        minutes: Number,
        seconds: Number
    },
    mainTimer: {
        minutes: Number,
        seconds: Number
    }
})

const TimerModel = mongoose.model('TimerModel', timerSchema)

module.exports = TimerModel