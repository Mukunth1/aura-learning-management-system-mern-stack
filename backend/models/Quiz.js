import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [v => v.length >= 2, 'Quiz question must have at least 2 options'],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    passingScore: {
      type: Number,
      default: 70, // percentage
      min: 0,
      max: 100,
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
