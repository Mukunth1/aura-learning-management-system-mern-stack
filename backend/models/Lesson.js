import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'link', 'zip', 'doc'], default: 'pdf' },
  size: { type: String, default: '1.2 MB' },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL or stream source is required'],
    },
    duration: {
      type: String, // e.g. "14:20"
      default: '10:00',
    },
    durationSeconds: {
      type: Number,
      default: 600,
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    resources: [resourceSchema],
    order: {
      type: Number,
      default: 1,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
