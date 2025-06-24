const express = require('express');
const router = express.Router();
const {
    createLostItem,
    getLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem,
} = require('../controller/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getLostItems)
    .post(protect, upload.single('image'), createLostItem);

router.route('/:id')
    .get(protect, getLostItemById)
    .put(protect, upload.single('image'), updateLostItem)
    .delete(protect, deleteLostItem);

module.exports = router;
