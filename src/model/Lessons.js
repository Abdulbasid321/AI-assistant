// const mongoose = require('mongoose');

// const videoLessonSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   note: { type: String, required: true },
//   subject: { type: String, required: true },
//   videoUrl: { type: String, required: true },
//   publicId: { type: String }, // Optional: if using Cloudinary
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('VideoLesson', videoLessonSchema);
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoPublicId: {
    type: String,
    required: true,
  },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Admin',
  //    required: false, // ✅ make it optional
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lesson', lessonSchema);
