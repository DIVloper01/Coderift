import express from 'express';
import {
  submitCode,
  getSubmissionStatus,
  getUserSubmissions,
  getContestLeaderboard,
} from '../controllers/submissionController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

router.post('/', authenticate, validate(schemas.submitCode), submitCode);
router.get('/:id', authenticate, getSubmissionStatus);
router.get('/user/history', authenticate, getUserSubmissions);
router.get('/leaderboard/:contestId', getContestLeaderboard);

export default router;
