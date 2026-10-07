import Discussion from '../models/Discussion.js';

// @desc    Get all discussions for a specific lesson
// @route   GET /api/discussions/lesson/:lessonId
// @access  Private
export const getLessonDiscussions = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const discussions = await Discussion.find({ lesson: lessonId })
      .populate('user', 'name avatar role')
      .populate('replies.user', 'name avatar role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: discussions.length,
      discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new question/discussion in a lesson
// @route   POST /api/discussions/lesson/:lessonId
// @access  Private
export const createDiscussion = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { courseId, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const discussion = await Discussion.create({
      lesson: lessonId,
      course: courseId,
      user: req.user._id,
      message,
      replies: [],
    });

    await discussion.populate('user', 'name avatar role');

    res.status(201).json({
      success: true,
      discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a discussion thread
// @route   POST /api/discussions/:discussionId/reply
// @access  Private
export const replyToDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion thread not found' });
    }

    discussion.replies.push({
      user: req.user._id,
      message,
      createdAt: new Date(),
    });

    await discussion.save();

    await discussion.populate('user', 'name avatar role');
    await discussion.populate('replies.user', 'name avatar role');

    res.status(200).json({
      success: true,
      message: 'Reply posted',
      discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a discussion
// @route   PUT /api/discussions/:discussionId/upvote
// @access  Private
export const upvoteDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    res.status(200).json({
      success: true,
      upvotes: discussion.upvotes,
    });
  } catch (error) {
    next(error);
  }
};
