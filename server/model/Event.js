const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    poster: {
        type: String, // image URL
    },
    date: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
