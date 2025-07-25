const Announcement = require('../models/Announcement');

// POST: Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    const newAnn = new Announcement({
      title,
      message,
    //   createdBy: req.user?.id || null,
    });

    await newAnn.save();
    res.status(201).json({ message: 'Announcement posted successfully', announcement: newAnn });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post announcement' });
  }
};

// GET: Fetch all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get announcements' });
  }
};
