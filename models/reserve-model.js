const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    resDate: {
        type: Date,
        required: true
    },
    resTime: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reserve', reserveSchema);