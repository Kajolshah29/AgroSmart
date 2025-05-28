const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    businessDetails: {
        businessName: String,
        businessType: String,
        businessLocation: String,
        preferredProducts: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
buyerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
buyerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Buyer = mongoose.model('Buyer', buyerSchema);
module.exports = Buyer; 