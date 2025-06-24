const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔐 Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ✅ Register User
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, phone, password, name, role, studentDetails, staffDetails, nonTeachingStaffDetails } = req.body;

    // For simplified registration, only email is required
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let userData = {
            name: name || 'New User',
            email,
            phone: phone || undefined,
            password: password || 'tempPassword123', // Default password that must be changed
            role: role || 'student',
            isVerified: false,
            studentDetails: {},
            staffDetails: {},
            nonTeachingStaffDetails: {},
        };

        // Add role-specific details and clear others
        if (userData.role === 'student') {
            userData.studentDetails = studentDetails || {};
            userData.staffDetails = {};
            userData.nonTeachingStaffDetails = {};
        } else if (userData.role === 'teaching_staff') {
            userData.staffDetails = staffDetails || {};
            userData.studentDetails = {};
            userData.nonTeachingStaffDetails = {};
        } else if (userData.role === 'non_teaching_staff') {
            userData.nonTeachingStaffDetails = nonTeachingStaffDetails || {};
            userData.studentDetails = {};
            userData.staffDetails = {};
        }

        const user = await User.create(userData);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            studentDetails: user.studentDetails,
            staffDetails: user.staffDetails,
            nonTeachingStaffDetails: user.nonTeachingStaffDetails,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Login User
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        console.log('Password in DB:', user.password);

        if (isMatch) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                studentDetails: user.studentDetails,
                staffDetails: user.staffDetails,
                nonTeachingStaffDetails: user.nonTeachingStaffDetails,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get User Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                studentDetails: user.studentDetails,
                staffDetails: user.staffDetails,
                nonTeachingStaffDetails: user.nonTeachingStaffDetails,
                additionalDetails: user.additionalDetails,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update User Profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        if (user.role === 'student') {
            user.studentDetails = req.body.studentDetails || user.studentDetails;
            user.staffDetails = {};
            user.nonTeachingStaffDetails = {};
        } else if (user.role === 'teaching_staff') {
            user.staffDetails = req.body.staffDetails || user.staffDetails;
            user.studentDetails = {};
            user.nonTeachingStaffDetails = {};
        } else if (user.role === 'non_teaching_staff') {
            user.nonTeachingStaffDetails = req.body.nonTeachingStaffDetails || user.nonTeachingStaffDetails;
            user.studentDetails = {};
            user.staffDetails = {};
        }
        user.additionalDetails = req.body.additionalDetails || user.additionalDetails;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            studentDetails: updatedUser.studentDetails,
            staffDetails: updatedUser.staffDetails,
            nonTeachingStaffDetails: updatedUser.nonTeachingStaffDetails,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   GET /api/users/verify-token
// @access  Private
const verifyToken = (req, res) => {
  res.json({ valid: true });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    verifyToken,
};
