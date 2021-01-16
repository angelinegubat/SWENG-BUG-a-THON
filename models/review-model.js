const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewsSchema);