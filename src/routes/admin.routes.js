const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const {getCurrentAdminProfile} = require('../controller/admin.controller');
const {verifyAdminToken} = require('../middleware/middleware'); 
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Lesson = require("../model/Lessons");

// Admin login route
router.post('/login', adminController.adminLogin);

// Create a new admin route
router.post('/create', adminController.createAdmin);

// Get all admins route
router.get('/all', adminController.getAllAdmins);

router.get('/profile', verifyAdminToken, getCurrentAdminProfile);

// Get a specific admin by ID
// router.get('/:adminId', adminController.getAdmin);

// // Update an admin by ID
// router.put('/:adminId', adminController.updateAdmin);

// // Delete an admin by ID
// router.delete('/:adminId', adminController.deleteAdmin);


// POST /admin/upload
// Upload a single lesson video with title and note
// router.post("/upload", upload.single("video"), async (req, res) => {
//   try {
//     const file = req.file;
//     const { title, note } = req.body;

//     if (!file) {
//       return res.status(400).json({ error: "No video file uploaded" });
//     }

//     if (!title || !note) {
//       return res.status(400).json({ error: "Title and note are required" });
//     }

//     const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "");

//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           public_id: `video_lessons/${safeTitle}_${file.originalname}`,
//           timeout: 120000,
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       ).end(file.buffer);
//     });

//     const newLesson = new Lesson({
//       title,
//       note,
//       videoUrl: uploadResult.secure_url,
//       publicId: uploadResult.public_id,
//     });

//     await newLesson.save();

//     res.status(201).json({
//       message: "Lesson uploaded successfully",
//       lesson: newLesson,
//     });

//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, note, subject } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'video_lessons',
          public_id: title.replace(/\s+/g, '_').toLowerCase(),
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    const newLesson = new Lesson({
      title,
      note,
      subject,
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
      createdBy: req.adminId || null, // optional
    });

    await newLesson.save();

    res.status(201).json({
      message: 'Lesson uploaded successfully',
      lesson: newLesson,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});


router.get('/videos', adminController.getAllLessons); // ✅ GET not POST

// routes/admin.routes.js
router.delete('/video/:id', adminController.deleteLesson);


// Get a specific admin by ID
router.get('/:adminId', adminController.getAdmin);

// Update an admin by ID
router.put('/:adminId', adminController.updateAdmin);

// Delete an admin by ID
router.delete('/:adminId', adminController.deleteAdmin);


module.exports = router;

// routes/adminRoutes.js

// const express = require('express');
// const router = express.Router();
// const VideoLesson = require('../models/VideoLesson');
// const multer = require('multer');
// const { cloudinaryUpload } = require('../utils/cloudinary'); // Optional Cloudinary helper
// const auth = require('../middleware/auth'); // Your admin auth middleware

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // POST /admin/upload
// router.post('/upload', auth, upload.single('video'), async (req, res) => {
//   try {
//     const { title, note, subject } = req.body;
//     const file = req.file;

//     if (!file || !title || !note || !subject) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Upload to cloud (or handle locally)
//     const result = await cloudinaryUpload(file.buffer, 'video'); // Adjust for your storage
//     const newLesson = await VideoLesson.create({
//       title,
//       note,
//       subject,
//       videoUrl: result.secure_url,
//       publicId: result.public_id,
//     });

//     res.status(201).json({ message: 'Uploaded successfully', lesson: newLesson });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to upload lesson' });
//   }
// });

// // GET /admin/videos
// router.get('/videos', authMiddleware, async (req, res) => {
//   try {
//     const videos = await VideoLesson.find().sort({ createdAt: -1 });
//     res.json({ videos });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch videos' });
//   }
// });

// // GET /admin/stats
// router.get('/stats', authMiddleware, async (req, res) => {
//   try {
//     const totalVideos = await VideoLesson.countDocuments();
//     const totalStudents = await Student.countDocuments(); // if you have a Student model
//     const questionsAsked = await Question.countDocuments(); // if you track AI questions

//     res.json({ totalVideos, totalStudents, questionsAsked });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch stats' });
//   }
// });
