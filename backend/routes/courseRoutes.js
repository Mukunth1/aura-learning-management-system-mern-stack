import express from 'express';
import {
  getAllCourses,
  getFeaturedCourses,
  getCourseDetails,
  getCategories,
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getCourseDetails);

export default router;
