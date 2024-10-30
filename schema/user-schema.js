const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utilities/user-roles');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'Not a valid email address']
    },
    phoneNo: {
        type: Number
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.MEMBER],
        default: userRoles.MEMBER
    }
});
module.exports = mongoose.model("User", userSchema);