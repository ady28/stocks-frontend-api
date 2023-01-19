const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and a password', 400));
    }

    //Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid login data', 401));
    }

    //Check password
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('Invalid login data', 401));
    }

   tokenResponse(user, 200, res)
});

// @desc      Get logged on user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Log user out
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expire: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        //sameSite: 'none',
        //secure: true
    })

    res.status(200).json({
        success: true,
        data: {}
    });
});

const tokenResponse = (user, statusCode, res) => {
    const token = user.signJWTToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        //sameSite: 'none',
        //secure: true
    };

    var retObj = {
        name: user.name,
        email: user.email,
        role: user.role
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, data: retObj})
}