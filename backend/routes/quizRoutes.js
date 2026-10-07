import express from 'express';
import {
  getQuizByCourse,
  submitQuizAttempt,
  getMyQuizAttempts,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', protect, getQuizByCourse);
router.post('/:quizId/submit', protect, submitQuizAttempt);
router.get('/my-attempts', protect, getMyQuizAttempts);

export default router;
