import User from '../../models/User.js';
import logger from '../../utils/logger.js';
import { sendResponse } from '../../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') } // Case-Insensitive Check: To prevent "john" and "John" being different users:
    });
    if (existingUser) {
      throw new Error('Username already exists. Please login instead.');
    }
    if (existingUser) {
      return sendResponse(res, 409, null, 'Username already exists. Please login instead.');
    }

    const user = await User.create({ name, username, password });
    const token = user.generateAuthToken();

    logger.info(`New user registered: ${username}`);
    sendResponse(res, 201, { token }, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password exist
    if (!username || !password) {
      throw new Error('Please provide username and password');
    }

    // Check if user exists
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = user.generateAuthToken();

    logger.info(`User logged in: ${username}`);
    sendResponse(res, 200, { token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    sendResponse(res, 200, user, 'User profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};