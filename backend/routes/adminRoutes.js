import express from 'express';
import {
  getAdminMetrics,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Restrict entire admin router to Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getAdminMetrics);
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:courseId/approve', approveCourse);
router.put('/courses/:courseId/reject', rejectCourse);

export default router;
