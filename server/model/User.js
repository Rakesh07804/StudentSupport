const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'New User',
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teaching_staff', 'non_teaching_staff', 'admin'],
        default: 'student',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    studentDetails: {
        branch: String,
        degree: String,
    },
    staffDetails: {
        subject: String,
        designation: String,
    },
    nonTeachingStaffDetails: {
        details: String,
    },
    additionalDetails: {
        type: String,
    },
}, { timestamps: true });

// Hash password if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
