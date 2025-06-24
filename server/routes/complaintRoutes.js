const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    addComment,
} = require('../controller/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// /api/complaints/
router.route('/')
    .get(protect, getComplaints)
    .post(protect, upload.single('image'), createComplaint);

// /api/complaints/:id
router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, upload.single('image'), updateComplaint)
    .delete(protect, deleteComplaint);

// /api/complaints/:id/comments
router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
