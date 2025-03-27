const User = require("../models/userModel");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            to: user.email,
            subject: "Password Reset OPT",
            text: `Your OTP to reset your password is: ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    msg: "Error sending otp mail",
                    error
                });
            }
            res.status(200).json({
                msg: "otp send to your mail"
            });
        })
    }
    catch (error) {
        res.status(500).json({
            msg: "server error",
            error: error.message
        });
    }
}

exports.verifyOTPAndChangePassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                msg: "user not found"
            });
        }
        if (Date.now() > user.otpExpiration) {
            return res.status(400).json({
                msg: "otp has expired"
            });
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                msg: "Invalid otp"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiration = undefined;
        const newUser = await user.save();
        res.status(200).json({
            msg: "password changed successfully",
            newUser
        });

    }
    catch (error) {
        res.status(500).json({
            msg: 'Error resetting password',
            error: error.message
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.resetToken !== resetToken) {
            return res.status(400).json({
                msg: "Invalid token"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();
        res.status(200).json({
            msg: "Password updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "server error",
            error: error.message
        });
    }
}

