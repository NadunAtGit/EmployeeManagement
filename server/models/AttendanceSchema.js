const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // Store date as a string in "YYYY-MM-DD" format
  status: { type: String, enum: ['Present', 'Absent', 'On Leave'], default: 'Present' },
  arrivalTime: { type: String, required: function () { return this.status === 'Present'; } }, // Format: "YYYY-MM-DD HH:mm"
  departureTime: { type: String, default: "undefined" }, // Format: "YYYY-MM-DD HH:mm"
});

module.exports = mongoose.model('Attendance', attendanceSchema);

