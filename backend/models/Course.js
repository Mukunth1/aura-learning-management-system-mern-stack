import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Course subtitle is required'],
      maxlength: [240, 'Subtitle cannot exceed 240 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      enum: [
        'Web Development',
        'AI & Machine Learning',
        'Cloud & DevOps',
        'Mobile Development',
        'UI/UX Design',
        'Cybersecurity',
        'Data Science',
        'Software Engineering',
      ],
    },
    level: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    },
    trailerVideoUrl: {
      type: String,
      default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'published',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    requirements: {
      type: [String],
      default: ['Basic computer literacy', 'A desire to learn modern tech stack'],
    },
    whatYouWillLearn: {
      type: [String],
      default: ['Master core industry principles', 'Build production-ready applications'],
    },
    tags: {
      type: [String],
      default: ['react', 'node', 'fullstack'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save slug generator
courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
