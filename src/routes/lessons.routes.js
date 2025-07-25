const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadLesson,
  getAllLessons,
  deleteLesson,
} = require('../controllers/lessonController');

// Upload a lesson
router.post('/upload', upload.single('video'), uploadLesson);

// Get all lessons
router.get('/videos', getAllLessons);

// Delete a lesson
router.delete('/lessons/:id', deleteLesson);

module.exports = router;
