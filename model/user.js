const mongoose = require('mongoose');

/**
 * User schema
 */
const userSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isVerified: {type: Boolean, default: false},
        createAt: {type: Date, required: true, default: Date.now},
        updateAt: {type: Date, required: true, default: Date.now}
    }, {
        versionKey: false
    });

module.exports = mongoose.model('User', userSchema, 'user');

