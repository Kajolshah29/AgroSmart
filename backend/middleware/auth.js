const jwt = require('jsonwebtoken');

const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = null;
        if (decoded.role === 'farmer') {
            user = await Farmer.findOne({ _id: decoded.userId });
        } else if (decoded.role === 'buyer') {
            user = await Buyer.findOne({ _id: decoded.userId });
        }

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    };
};

module.exports = { auth, checkRole }; 