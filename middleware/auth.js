const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const getJWTSecret = require('../utils/auth')

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    else if(req.cookies.token) {
        token = req.cookies.token
    }

    if(!token) {
        return next(new ErrorResponse('Not authenticated', 401))
    }

    try {
        //Verify token
        const JWTSecret = getJWTSecret();
        const decoded = jwt.verify(token, JWTSecret);

        req.user = await User.findById(decoded.id);

        next();
    } catch(err) {
        return next(new ErrorResponse('Not authenticated', 401))
    }
});

//Grant access to roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Not authorized', 401))
        }

        next();
    }
}