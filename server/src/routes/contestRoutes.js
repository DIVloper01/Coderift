import express from 'express';
import {
  createContest,
  updateContest,
  deleteContest,
  getAllContests,
  getContestById,
  joinContest,
} from '../controllers/contestController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

router.post('/', authenticate, requireAdmin, validate(schemas.createContest), createContest);
router.put('/:id', authenticate, requireAdmin, updateContest);
router.delete('/:id', authenticate, requireAdmin, deleteContest);
router.get('/', getAllContests);
router.get('/:id', getContestById);
router.post('/:id/join', authenticate, joinContest);

export default router;
