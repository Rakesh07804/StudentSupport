const Event = require('../model/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    const { title, description, date, venue } = req.body;
    const poster = req.file ? `/uploads/${req.file.filename}` : '';

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Validate required fields
    if (!title || !date || !venue) {
        return res.status(400).json({ message: 'Title, date, and venue are required' });
    }

    if (isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    try {
        const event = new Event({
            user: req.user._id,
            title,
            description,
            poster,
            date,
            venue,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .populate('user', 'name role')
            .sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('user', 'name role');

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
    const { title, description, poster, date, venue } = req.body;

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.poster = poster || event.poster;
        event.date = date || event.date;
        event.venue = venue || event.venue;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
