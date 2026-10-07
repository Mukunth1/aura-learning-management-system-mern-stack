import express from 'express';
import {
  getLessonDiscussions,
  createDiscussion,
  replyToDiscussion,
  upvoteDiscussion,
} from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/lesson/:lessonId', protect, getLessonDiscussions);
router.post('/lesson/:lessonId', protect, createDiscussion);
router.post('/:discussionId/reply', protect, replyToDiscussion);
router.put('/:discussionId/upvote', protect, upvoteDiscussion);

export default router;
