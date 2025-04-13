import express from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  let user = await User.findOne({ email });

  // If user doesn't exist, create the hardcoded user
  if (!user && email === 'intern@dacoid.com') {
    user = await User.create({
      email: 'intern@dacoid.com',
      password: 'Test123'
    });
  }

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        id: user._id,
        email: user.email
      },
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email
  });
}));

export default router;