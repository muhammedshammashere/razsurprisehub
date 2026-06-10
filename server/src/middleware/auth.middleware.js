import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ApiError(401, 'User not found'));
    }
    next();
  } catch {
    next(new ApiError(401, 'Not authorized, invalid token'));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};
