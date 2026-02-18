import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'participant',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
    if (!tokenExists) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from database
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: { token: refreshToken } },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user.toPublicJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};
