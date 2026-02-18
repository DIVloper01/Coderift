import express from 'express';
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByContest,
  getProblemById,
} from '../controllers/problemController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

router.post('/', authenticate, requireAdmin, validate(schemas.createProblem), createProblem);
router.put('/:id', authenticate, requireAdmin, updateProblem);
router.delete('/:id', authenticate, requireAdmin, deleteProblem);
router.get('/contest/:contestId', getProblemsByContest);
router.get('/:id', getProblemById);

export default router;
