const Complaint = require('../model/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    const { subject, description } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Validate input
    if (!subject || !description) {
        return res.status(400).json({ message: 'Subject and description are required' });
    }

    try {
        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const complaint = new Complaint({
            user: req.user._id,
            subject,
            description,
            image: imagePath,
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .populate('user', 'name role')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'name role')
            .populate('comments.user', 'name role');
        if (complaint) {
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
    const { subject, description } = req.body;

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            if (complaint.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this complaint' });
            }

            complaint.subject = subject || complaint.subject;
            complaint.description = description || complaint.description;
            
            // Handle image upload for updates
            if (req.file) {
                complaint.image = `/uploads/${req.file.filename}`;
            }

            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            if (complaint.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this complaint' });
            }

            await complaint.deleteOne();
            res.json({ message: 'Complaint removed' });
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add a comment to a complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
const addComment = async (req, res) => {
    const { text } = req.body;

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            const comment = {
                user: req.user._id,
                name: req.user.name,
                text,
            };

            complaint.comments.push(comment);
            await complaint.save();
            res.status(201).json({ message: 'Comment added' });
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    addComment,
};
