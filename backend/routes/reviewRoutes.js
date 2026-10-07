import express from 'express';
import { addReview, getCourseReviews, likeReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', getCourseReviews);
router.post('/course/:courseId', protect, addReview);
router.put('/:reviewId/like', protect, likeReview);

export default router;
