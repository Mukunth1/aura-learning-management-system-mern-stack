import express from 'express';
import {
  getInstructorStats,
  getMyInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addSection,
  addLesson,
  createOrUpdateQuiz,
} from '../controllers/instructorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth and instructor/admin authorization to all routes
router.use(protect);
router.use(authorize('instructor', 'admin'));

router.get('/stats', getInstructorStats);
router.get('/courses', getMyInstructorCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/courses/:courseId/sections', addSection);
router.post('/sections/:sectionId/lessons', addLesson);
router.post('/courses/:courseId/quiz', createOrUpdateQuiz);

export default router;
