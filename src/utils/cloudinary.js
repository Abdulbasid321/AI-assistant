// GET /admin/stats
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

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dg1hrifnk",
  api_key:    "364159795788712",
  api_secret: "vW2G-Yt6aNJ35Kq2hXfQx7ZAj7o"
});

module.exports = cloudinary;