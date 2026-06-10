import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sendUserResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, password, phone });
  sendUserResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendUserResponse(res, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(phone && { phone }), ...(address && { address }) },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
});
