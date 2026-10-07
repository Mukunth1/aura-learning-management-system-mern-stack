import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';

// @desc    Get admin platform-wide statistics and KPI metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin only)
export const getAdminMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const instructorsCount = await User.countDocuments({ role: 'instructor' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const rejectedCourses = await Course.countDocuments({ status: 'rejected' });

    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const totalCertificates = await Certificate.countDocuments();

    // Approximate platform gross revenue
    const courses = await Course.find({ status: 'published' });
    const totalRevenue = courses.reduce((acc, c) => {
      const price = c.discountPrice > 0 ? c.discountPrice : c.price;
      return acc + (c.studentsCount || 0) * price;
    }, 0);

    // Platform user growth mockup trends for Recharts
    const growthData = [
      { month: 'Apr', users: Math.round(totalUsers * 0.4), enrollments: Math.round(totalEnrollments * 0.3) },
      { month: 'May', users: Math.round(totalUsers * 0.52), enrollments: Math.round(totalEnrollments * 0.45) },
      { month: 'Jun', users: Math.round(totalUsers * 0.68), enrollments: Math.round(totalEnrollments * 0.6) },
      { month: 'Jul', users: Math.round(totalUsers * 0.79), enrollments: Math.round(totalEnrollments * 0.72) },
      { month: 'Aug', users: Math.round(totalUsers * 0.88), enrollments: Math.round(totalEnrollments * 0.85) },
      { month: 'Sep', users: totalUsers, enrollments: totalEnrollments },
    ];

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        studentsCount,
        instructorsCount,
        adminsCount,
        totalCourses,
        publishedCourses,
        pendingCourses,
        rejectedCourses,
        totalEnrollments,
        completedEnrollments,
        totalCertificates,
        totalRevenue,
      },
      growthData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with role filter & search
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'All') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:userId/role
// @access  Private (Admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses pending approval
// @route   GET /api/admin/courses/pending
// @access  Private (Admin only)
export const getPendingCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ status: { $in: ['pending', 'draft'] } })
      .populate('instructor', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a course
// @route   PUT /api/admin/courses/:courseId/approve
// @access  Private (Admin only)
export const approveCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'published', rejectionReason: '' },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course approved and published to live catalog',
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a course
// @route   PUT /api/admin/courses/:courseId/reject
// @access  Private (Admin only)
export const rejectCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'rejected', rejectionReason: reason || 'Does not meet our content quality guidelines' },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course rejected',
      course,
    });
  } catch (error) {
    next(error);
  }
};
