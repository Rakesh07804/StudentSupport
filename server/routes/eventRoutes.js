const express = require('express');
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require('../controller/eventController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Only define `.route('/')` once!
router.route('/')
    .get(protect, getEvents)
    .post(protect, upload.single('poster'), createEvent);  // 👈 Handle file upload here

router.route('/:id')
    .get(protect, getEventById)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

module.exports = router;
