import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token',
    });
  }
};
