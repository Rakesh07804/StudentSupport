const LostFound = require('../model/LostFound'); // Make sure you have this model

// @desc    Report a new lost/found item
// @route   POST /api/lostfound
// @access  Private
const createLostItem = async (req, res) => {
    const { itemName, description } = req.body;

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (!itemName || !description) {
        return res.status(400).json({ message: 'itemName and description are required' });
    }

    try {
        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const item = new LostFound({
            user: req.user._id,
            itemName,
            description,
            image: imagePath,
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all lost/found items
// @route   GET /api/lostfound
// @access  Private
const getLostItems = async (req, res) => {
    try {
        const items = await LostFound.find({})
            .populate('user', 'name role')
            .sort({ dateFound: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a lost/found item by ID
// @route   GET /api/lostfound/:id
// @access  Private
const getLostItemById = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id).populate('user', 'name role');

        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a lost/found item
// @route   PUT /api/lostfound/:id
// @access  Private
const updateLostItem = async (req, res) => {
    const { title, description, locationFound, dateFound } = req.body;

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        item.title = title || item.title;
        item.description = description || item.description;
        item.locationFound = locationFound || item.locationFound;
        item.dateFound = dateFound || item.dateFound;
        
        // Handle image upload for updates
        if (req.file) {
            item.image = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a lost/found item
// @route   DELETE /api/lostfound/:id
// @access  Private
const deleteLostItem = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createLostItem,
    getLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem,
};
