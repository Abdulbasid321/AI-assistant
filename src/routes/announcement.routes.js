const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /student/announcements
router.get('/announcements', studentController.getAnnouncements);

// GET /student/lessons
router.get('/lessons', studentController.getLessons);

// POST /student/ask-ai
router.post('/ask-ai', studentController.askAI);

module.exports = router;
