import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';

// Helper to generate a clean unique certificate ID
const generateCertificateId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LMS-${new Date().getFullYear()}-${code}`;
};

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private (Student, Instructor, Admin)
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: { path: 'lessons' },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course',
        enrollment,
      });
    }

    // Find first lesson for lastAccessedLesson
    let firstLessonId = null;
    if (course.sections && course.sections.length > 0) {
      for (const section of course.sections) {
        if (section.lessons && section.lessons.length > 0) {
          firstLessonId = section.lessons[0]._id;
          break;
        }
      }
    }

    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      lastAccessedLesson: firstLessonId,
      status: 'active',
    });

    // Increment students count on course
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses enrolled by the logged in user
// @route   GET /api/enrollments/my-courses
// @access  Private
export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title slug subtitle category level thumbnail rating numReviews price isFree instructor',
        populate: { path: 'instructor', select: 'name avatar' },
      })
      .populate('certificate', 'certificateId issueDate grade')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress details for a single enrolled course
// @route   GET /api/enrollments/course/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    }).populate('certificate');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course',
        isEnrolled: false,
      });
    }

    res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress & mark lesson as completed
// @route   POST /api/enrollments/course/:courseId/lesson/:lessonId/complete
// @access  Private
export const updateLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentId = req.user._id;

    let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    // Add lesson to completedLessons if not already present
    const isCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId.toString()
    );

    if (!isCompleted) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastAccessedLesson = lessonId;

    // Calculate total lessons in course
    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: { path: 'lessons' },
    });

    let totalLessons = 0;
    if (course.sections) {
      course.sections.forEach((sec) => {
        if (sec.lessons) totalLessons += sec.lessons.length;
      });
    }

    // Calculate percentage
    const completedCount = enrollment.completedLessons.length;
    const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 100;
    enrollment.progress = progressPercent;

    // Check if course completed (100%)
    if (progressPercent >= 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();

      // Issue Certificate if not already issued
      if (!enrollment.certificateIssued) {
        const certId = generateCertificateId();
        const cert = await Certificate.create({
          certificateId: certId,
          student: studentId,
          course: courseId,
          instructor: course.instructor,
          issueDate: new Date(),
          grade: 'Completed with Excellence (100%)',
        });

        enrollment.certificateIssued = true;
        enrollment.certificate = cert._id;
      }
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      status: enrollment.status,
      certificateIssued: enrollment.certificateIssued,
      certificateId: enrollment.certificate,
    });
  } catch (error) {
    next(error);
  }
};
