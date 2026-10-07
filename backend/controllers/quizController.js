import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Get quiz for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getQuizByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId }).populate('course', 'title');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this course yet',
      });
    }

    // Return questions with options (hide correctAnswerIndex for honesty until submitted)
    const questionsWithoutAnswers = quiz.questions.map((q, idx) => ({
      _id: q._id,
      index: idx,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        passingScore: quiz.passingScore,
        timeLimitMinutes: quiz.timeLimitMinutes,
        totalQuestions: quiz.questions.length,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and calculate auto-grading
// @route   POST /api/quizzes/:quizId/submit
// @access  Private
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // array of { questionIndex: number, selectedOptionIndex: number }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const detailedResults = quiz.questions.map((q, idx) => {
      const studentAnswer = answers ? answers.find((a) => a.questionIndex === idx) : null;
      const selectedIndex = studentAnswer ? studentAnswer.selectedOptionIndex : null;
      const isCorrect = selectedIndex !== null && selectedIndex === q.correctAnswerIndex;

      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        question: q.question,
        options: q.options,
        selectedOptionIndex: selectedIndex,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation || 'Review course material for detailed reasoning.',
      };
    });

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
    const passed = score >= quiz.passingScore;

    // Record the attempt
    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      answers: detailedResults.map((r) => ({
        questionIndex: r.questionIndex,
        selectedOptionIndex: r.selectedOptionIndex,
        isCorrect: r.isCorrect,
      })),
      score,
      totalQuestions,
      correctCount,
      passed,
    });

    res.status(200).json({
      success: true,
      message: passed ? 'Congratulations! You passed the quiz!' : 'Quiz completed. Keep studying to improve!',
      attemptId: attempt._id,
      score,
      passingScore: quiz.passingScore,
      passed,
      correctCount,
      totalQuestions,
      detailedResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quiz attempts for the logged in student
// @route   GET /api/quizzes/my-attempts
// @access  Private
export const getMyQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('quiz', 'title passingScore')
      .populate('course', 'title thumbnail')
      .sort('-completedAt');

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};
