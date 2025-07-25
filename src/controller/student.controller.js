// const Student = require('../model/Student');
const Student = require('../model/Student');
const jwt = require('jsonwebtoken');

// @desc    Register new student
exports.registerStudent = async (req, res) => {
  try {
    const { fullName, regNumber, email, phone } = req.body;

    if (!fullName || !regNumber || !email) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existing = await Student.findOne({ $or: [{ email }, { regNumber }] });
    if (existing) {
      return res.status(409).json({ message: 'Student already exists with this email or regNumber' });
    }

    const newStudent = await Student.create({ fullName, regNumber, email, phone });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select('-password'); // Exclude password
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.studentLogin = async (req, res) => {
    const { email, regNumber } = req.body;
    try {
      const student = await Student.login(email, regNumber);
      const token = jwt.sign(
        {
          data: {
            id: student._id,
            email: student.email,
            regNumber: student.regNumber,
          },
        },
        process.env.JWT_SECRET || 'poiuytrewqasdfghjklmnbvcxz',
        { expiresIn: '24h' }
      );
      res.status(200).json({ student, token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };