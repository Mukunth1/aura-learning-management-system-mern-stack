import express from 'express';
import {
  enrollInCourse,
  getMyCourses,
  getCourseProgress,
  updateLessonProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/enroll/:courseId', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);
router.get('/course/:courseId', protect, getCourseProgress);
router.post('/course/:courseId/lesson/:lessonId/complete', protect, updateLessonProgress);

export default router;
