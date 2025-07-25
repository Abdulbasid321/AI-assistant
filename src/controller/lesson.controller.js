const Lesson = require('../models/Lesson');

// Upload a new lesson
exports.uploadLesson = async (req, res) => {
  try {
    const { title, note, subject } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const lesson = new Lesson({
      title,
      note,
      subject,
      videoUrl: req.file.path,
      videoPublicId: req.file.filename,
      createdBy: req.user?.id || null, // if using auth middleware
    });

    await lesson.save();
    res.status(201).json({ message: 'Lesson uploaded successfully', lesson });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json({ videos: lessons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // Optional: remove from Cloudinary
    const cloudinary = require('../utils/cloudinary');
    await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
