import mongoose from 'mongoose';

const academicCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: Number,
      required: [true, 'courseId is required'],
      unique: true,
      index: true,
    },
    courseName: {
      type: String,
      required: [true, 'courseName is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AcademicCourse = mongoose.model('AcademicCourse', academicCourseSchema);
export default AcademicCourse;
