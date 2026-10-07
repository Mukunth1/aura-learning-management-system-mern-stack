import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for same course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to calculate average rating of a course
reviewSchema.statics.calculateAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        rating: 5.0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating course average rating:', err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
