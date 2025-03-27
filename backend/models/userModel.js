const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
        },
        roll: {
            type: String,
            required: true,
        },
        registeredID: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        amcatkey: {
            type: String,
        },
        amcat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Amcat",
        },
        platform:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Platform"
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
