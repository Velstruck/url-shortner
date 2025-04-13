import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Access denied. No token provided');
  }

  try {
    // Extract and verify token
    token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401);
      throw new Error('Access denied. Invalid token format');
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      res.status(401);
      throw new Error('Invalid token payload');
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User not found or deactivated');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error(error.message || 'Authentication failed');
  }
});

export { protect };