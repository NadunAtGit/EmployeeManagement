const mongoose = require("mongoose");



const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'] 
    },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['Admin', 'Manager', 'Technician', 'Receptionist'], 
      required: true 
    }
     // Optional for soft deletion
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);

  
module.exports = mongoose.model('User', userSchema);