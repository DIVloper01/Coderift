import express from 'express';
import { register, login, refreshToken, logout, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;
