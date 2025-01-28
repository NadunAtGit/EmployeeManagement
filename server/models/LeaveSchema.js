const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Recognize user by email
  username: { type: String, required: true },
  leaveDate: { type: Date, required: true },
  leaveType: { type: String, enum: ['Full Day', 'Half Day'], required: true },
  status: { type: String, enum: ['Approved', 'Not Approved'], default: 'Not Approved' }, // Default status
  reason: { type: String, required: true }, // New field for reason
});

module.exports = mongoose.model('Leave', LeaveSchema);
