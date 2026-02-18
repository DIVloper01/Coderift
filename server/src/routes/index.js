import express from 'express';
import authRoutes from './authRoutes.js';
import contestRoutes from './contestRoutes.js';
import problemRoutes from './problemRoutes.js';
import submissionRoutes from './submissionRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contests', contestRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
