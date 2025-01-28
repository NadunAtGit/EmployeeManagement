const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['Admin', 'Manager', 'Technician', 'Receptionist'], 
      default: 'Technician' 
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    salary: { type: Number, required: true,default:0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    dateOfJoining: { type: Date, required: true },
    rating:{type:Number,required:true,default:0},
    imageUrl:{
        type:String,
        required:true
    },
  });
 


module.exports = mongoose.model('Employee', employeeSchema);