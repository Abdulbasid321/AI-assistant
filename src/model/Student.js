const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
}, { timestamps: true });

studentSchema.statics.login = async function (email, regNumber) {
  const student = await this.findOne({ email });

  if (!student) {
    throw Error("Incorrect email");
  }

  if (student.regNumber !== regNumber) {
    throw Error("Incorrect registration number");
  }

  return student;
};


module.exports = mongoose.model('Student', studentSchema);
