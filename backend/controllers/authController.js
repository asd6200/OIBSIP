const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../config/mailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'royal_pizza_secret_key', {
    expiresIn: '7d',
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
      isVerified: false,
      verificationOTP: otp,
    });

    // Send verification email
    await sendVerificationEmail(user.email, otp);

    res.status(201).json({
      message: 'Registration successful! Verification OTP sent to your email.',
      email: user.email,
      userId: user._id,
      otp, // return OTP in dev response for ease of testing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationOTP = null;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully!',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletPoints: user.walletPoints,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified && user.role !== 'admin') {
      return res.status(401).json({
        message: 'Email is not verified. Please verify your email first.',
        isVerified: false,
        email: user.email,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletPoints: user.walletPoints,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login (Restricted to Admin Role)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminUser = await User.findOne({ email: email.toLowerCase() });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not authorized as Admin.' });
    }

    const isMatch = await adminUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      token: generateToken(adminUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password Flow
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    res.json({
      message: 'Password reset link sent to your email.',
      resetToken, // for dev ease
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.address) user.address = req.body.address;
    if (req.body.phone) user.phone = req.body.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '+91 9876543210',
      address: updatedUser.address,
      role: updatedUser.role,
      walletPoints: updatedUser.walletPoints,
      isVerified: updatedUser.isVerified,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
};
