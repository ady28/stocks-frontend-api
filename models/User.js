const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getJWTSecret = require('../utils/auth')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is not valid']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    }
});

UserSchema.methods.signJWTToken = function() {
    const JWTSecret = getJWTSecret();
    return jwt.sign({ id: this._id }, JWTSecret, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema);