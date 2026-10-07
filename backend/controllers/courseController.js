import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import Review from '../models/Review.js';

// @desc    Get all published courses with search, filters, pagination, and sorting
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      priceType, // 'free' | 'paid'
      minRating,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'published' };

    // Search keyword in title, subtitle, or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price filter
    if (priceType === 'free') {
      query.isFree = true;
    } else if (priceType === 'paid') {
      query.isFree = false;
      query.price = { $gt: 0 };
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sort mapping
    let sortBy = '-createdAt';
    if (sort === 'popular') sortBy = '-studentsCount';
    else if (sort === 'rating') sortBy = '-rating';
    else if (sort === 'price-low') sortBy = 'price';
    else if (sort === 'price-high') sortBy = '-price';
    else if (sort === 'newest') sortBy = '-createdAt';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalCourses = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline bio')
      .populate({
        path: 'sections',
        populate: { path: 'lessons', select: 'title duration durationSeconds isFreePreview' },
      })
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: courses.length,
      total: totalCourses,
      totalPages: Math.ceil(totalCourses / limitNum) || 1,
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured courses for landing page showcase
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req, res, next) => {
  try {
    const featured = await Course.find({ status: 'published', isFeatured: true })
      .populate('instructor', 'name avatar headline')
      .populate({
        path: 'sections',
        populate: { path: 'lessons', select: 'title duration isFreePreview' },
      })
      .limit(8);

    // If fewer than 4 featured, pull highest rated
    let courses = featured;
    if (courses.length < 4) {
      courses = await Course.find({ status: 'published' })
        .populate('instructor', 'name avatar headline')
        .populate({
          path: 'sections',
          populate: { path: 'lessons', select: 'title duration isFreePreview' },
        })
        .sort('-rating -studentsCount')
        .limit(8);
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:idOrSlug
// @access  Public
export const getCourseDetails = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let course;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(idOrSlug);
    } else {
      course = await Course.findOne({ slug: idOrSlug });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Populate instructor, sections, lessons, reviews
    await course.populate('instructor', 'name avatar headline bio website github linkedin');
    await course.populate({
      path: 'sections',
      populate: {
        path: 'lessons',
        select: 'title description duration durationSeconds videoUrl pdfUrl resources order isFreePreview',
      },
    });

    const reviews = await Review.find({ course: course._id })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      course,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course categories with aggregate course counts
// @route   GET /api/courses/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const stats = await Course.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = stats.map(cat => ({
      name: cat._id,
      count: cat.count,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
