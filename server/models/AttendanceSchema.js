const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'On Leave'], default: 'Present' },
  arrivalTime: { type: String, required: function () { return this.status === 'Present'; } }, // Format: HH:mm
  departureTime: { type: String ,default:"undefined"}, // Initially optional; updated later when the employee clocks out
});

module.exports = mongoose.model('Attendance', attendanceSchema);
