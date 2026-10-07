import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Add review to a course
// @route   POST /api/reviews/course/:courseId
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ course: courseId, user: userId });
    if (existing) {
      existing.rating = rating || existing.rating;
      existing.comment = comment || existing.comment;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review: existing,
      });
    }

    const review = await Review.create({
      course: courseId,
      user: userId,
      rating,
      comment,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a review
// @route   PUT /api/reviews/:reviewId/like
// @access  Private
export const likeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      likes: review.likes,
    });
  } catch (error) {
    next(error);
  }
};
