import { Response } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields: name, email, password' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar,
    });

    if (user) {
      const token = generateToken(user._id.toString());
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error: any) {
    console.error('[Auth Controller] Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id.toString());
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('[Auth Controller] Login Error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching user profile' });
  }
};

// @desc    Get all users for transfer target selection
// @route   GET /api/auth/users
// @access  Private
export const getUsersForSharing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?._id;
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('name email avatar createdAt')
      .sort({ name: 1 });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching users list' });
  }
};
