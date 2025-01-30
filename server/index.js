const express=require("express");
const bcrypt=require("bcryptjs");
const moment = require('moment');
const config=require("./config.json");
const mongoose=require("mongoose");
const cors = require("cors");
const User=require("./models/UserSchema");
const Employee=require("./models/EmployeeeSchema");
const Attendance=require("./models/AttendanceSchema");
const {authenticateToken,authorizeRoles} =require("./utilities");
const jwt=require("jsonwebtoken");
require('dotenv').config();
const upload=require("./multer");
const fs=require("fs");
const path=require("path");
const Leave=require("./models/LeaveSchema");
const { escape } = require("querystring");


const app=express();
app.use(cors({}));
app.use(express.json());
const PORT = process.env.PORT || 8000;

const clientBuildPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientBuildPath));

// Catch-all route to serve index.html for React Router
app.get("*", (req, res) => {
  res.sendFile(path.resolve(clientBuildPath, "index.html"));
});

mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);  // Exit the process on database connection failure
  });



app.post("/signin-admin", async (req, res) => {
    console.log("Request received:", req.body); // Log incoming request
    const { userName, password, role, email } = req.body;
    
    if (!userName || !email || !password || !role) {
      console.log("Missing parameters");
      return res.status(400).json({ error: true, message: "All parameters required" });
    }
  
    try {
      const existingAdmin = await User.findOne({ role: "Admin" });
      console.log("Existing Admin:", existingAdmin);
  
      if (existingAdmin) {
        return res.status(400).json({ 
          error: true, 
          message: "An admin already exists. Use the admin account to create additional users." 
        });
      }
  
      const isUser = await User.findOne({ email });
      console.log("Existing User:", isUser);
  
      if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);
  
      const newUser = new User({
        username: userName,
        email: email,
        password: hashedPassword,
        role: "Admin",
        createdAt: new Date(),
      });
  
      await newUser.save();
      console.log("New User Saved:", newUser);
  
      const accessToken = jwt.sign(
        { userId: newUser._id, role: newUser.role ,email:newUser.email},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
      );
  
      console.log("Access Token Generated:", accessToken);
  
      return res.status(200).json({
        error: false,
        user: {
          username: userName,
          email: email,
          createdOn: newUser.createdAt,
        },
        accessToken,
        message: "Admin created successfully",
      });
    } catch (error) {
      console.error("Error in /signin-admin:", error);
      return res.status(500).json({ error: true, message: "Server error" });
    }
  });

app.post(
    "/create-employee",
    authenticateToken,
    authorizeRoles(['Admin']),
    async (req, res) => {
        const {
            username,
            email,
            password,
            role,
            name,
            department,
            phone,
            salary,
            dateOfJoining,
            imageUrl,
        } = req.body;

        // Check if all required fields are provided
        if (
            !username ||
            !email ||
            !password ||
            !role ||
            !name ||
            !department ||
            !phone ||
            !salary ||
            !dateOfJoining ||
            !imageUrl
        ) {
            return res.status(400).json({ error: true, message: "All fields are required." });
        }

        try {
            // Check if employee/user already exists
            const existingUser = await User.findOne({ email });
            const existingEmployee = await Employee.findOne({ email });

            if (existingUser || existingEmployee) {
                return res
                    .status(400)
                    .json({ error: true, message: "Employee with this email already exists." });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create User Object
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role,
            });

            await newUser.save();

            // Create Employee Object
            const newEmployee = new Employee({
                username,
                email,
                password: hashedPassword,
                role,
                name,
                department,
                phone,
                salary,
                dateOfJoining,
                imageUrl,
            });

            await newEmployee.save();

            // Response
            return res.status(201).json({
                error: false,
                message: "Employee and user accounts created successfully.",
                employee: {
                    username: newEmployee.username,
                    email: newEmployee.email,
                    name: newEmployee.name,
                    role: newEmployee.role,
                },
            });
        } catch (error) {
            console.error("Error creating employee:", error);
            return res.status(500).json({ error: true, message: "Internal server error." });
        }
    }
);
  
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: true, message: "All parameters required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
      return res.status(404).json({error:true, message: "User not found" });
  }

  const isPasswordValid=await bcrypt.compare(password,user.password);
  if(!isPasswordValid){
      return res.status(400).json({error:true,message:"Invalid Password"});
  }

  const accessToken=jwt.sign(
      {userId:user._id, role: user.role,email:user.email},
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn:"72h"
      }
  )

  return res.json({
      error:false,
      message:"login is successfull",
      user:{
              fullName:user.username,
              email:user.email,

      },
      accessToken,


  });
});

app.get(
  "/get-all-employees",
  authenticateToken,
  authorizeRoles(["Admin"]),
  async (req, res) => {
    try {
      // Fetch all employees
      const employees = await Employee.find();

      // Calculate total employees
      const totalEmployees = employees.length;

      // Send successful response
      res.status(200).json({
        error: false,
        employees,
        totalEmployees, // Include totalEmployees in the response
      });
    } catch (error) {
      console.error("Error fetching employees:", error);

      // Send error response
      res.status(500).json({
        error: true,
        message: "Failed to fetch employees. Please try again later.",
      });
    }
  }
);


app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Extract email from the authenticated user

    // Search for the employee by email
    const isEmployee = await Employee.findOne({ email });
    if (!isEmployee) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Return the employee's data
    return res.status(200).json({
      error: false,
      user: isEmployee,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user info:", error);

    // Send error response
    return res.status(500).json({
      error: true,
      message: "Failed to fetch user details. Please try again later.",
    });
  }
});

//search
app.get("/search", authenticateToken, authorizeRoles(["Admin"]), async (req, res) => {
  const { query } = req.query;

  // Validate that the query parameter is provided
  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    // Search for employees based on username, department, or role
    const searchResults = await Employee.find({
      $or: [
        { username: { $regex: query, $options: "i" } },   // Case-insensitive search for username
        { department: { $regex: query, $options: "i" } }, // Case-insensitive search for department
        { role: { $regex: query, $options: "i" } },       // Case-insensitive search for role
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Search completed successfully",
      results: searchResults,
    });
  } catch (error) {
    console.error("Error during search:", error);

    return res.status(500).json({
      error: true,
      message: "An error occurred while performing the search. Please try again later.",
    });
  }
});

app.delete("/delete-employee/:id", authenticateToken, authorizeRoles(["Admin"]), async (req, res) => {
  const { id } = req.params;

  // Validate that the `id` parameter is provided
  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Employee ID is required",
    });
  }

  try {
    // Check if the employee exists in the database
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: true,
        message: "Employee not found",
      });
    }

    // Extract email or username from the employee record
    const { email, username } = employee;

    // Delete the corresponding User document
    const userDeletionResult = await User.deleteOne({
      $or: [{ email }, { username }],
    });

    if (userDeletionResult.deletedCount === 0) {
      console.warn(`No User document found for email: ${email} or username: ${username}`);
    }

    // Delete the employee record
    await employee.deleteOne();

    // Return success response
    return res.status(200).json({
      error: false,
      message: `Employee with ID ${id} and related User record have been deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);

    // Handle server errors
    return res.status(500).json({
      error: true,
      message: "Failed to delete the employee. Please try again later.",
    });
  }
});


//increase rating
app.put("/update-rating/:id", authenticateToken, authorizeRoles(["Admin", "Manager"]), async (req, res) => {
  const { id } = req.params; // Employee ID from the URL
  const { rating } = req.body; // New rating from the request body

  // Validate that a rating is provided
  if (rating === undefined) {
    return res.status(400).json({
      error: true,
      message: "Rating is required",
    });
  }

  // Validate that the rating is a number and within the expected range
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return res.status(400).json({
      error: true,
      message: "Rating must be a number between 0 and 5",
    });
  }

  try {
    // Find the employee by ID
    const employee = await Employee.findById(id);

    // Check if the employee exists
    if (!employee) {
      return res.status(404).json({
        error: true,
        message: "Employee not found",
      });
    }

    // Update the employee's rating
    employee.rating = rating;
    await employee.save();

    return res.status(200).json({
      error: false,
      message: `Employee rating updated successfully`,
      employee,
    });
  } catch (error) {
    console.error("Error updating employee rating:", error);

    // Handle server errors
    return res.status(500).json({
      error: true,
      message: "Failed to update the rating. Please try again later.",
    });
  }
});

//update-employee

app.put("/update-employee/:id", authenticateToken, authorizeRoles(["Admin", "Manager"]), async (req, res) => {
  const { id } = req.params;
  const { username, phone, salary, status, department } = req.body;

  try {
    // Validate that the employee ID is provided
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Employee ID is required",
      });
    }

    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        error: true,
        message: "Employee not found",
      });
    }

    // Check if the `username` is unique (if provided)
    if (username) {
      const usernameExists = await Employee.findOne({ username, _id: { $ne: id } }); // Exclude current employee
      if (usernameExists) {
        return res.status(400).json({
          error: true,
          message: "Username already exists. Please choose a different username.",
        });
      }
      employee.username = username;
    }

    // Update fields if they are provided in the request
    if (phone) employee.phone = phone;
    if (salary !== undefined) employee.salary = salary; // Allow salary to be 0
    if (status) employee.status = status;
    if (department) employee.department = department;

    // Save the updated employee document
    const updatedEmployee = await employee.save();

    // Respond with the updated employee details
    return res.status(200).json({
      error: false,
      message: "Employee details updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee details:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to update employee details. Please try again later.",
    });
  }
});

app.post("/mark-attendance", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Get email from authenticated user
    const { status } = req.body; // Get status from the request body

    if (!status) {
      return res.status(400).json({
        error: true,
        message: "Status is required.",
      });
    }

    if (!["Present", "Absent", "On Leave"].includes(status)) {
      return res.status(400).json({
        error: true,
        message: "Invalid status. Status should be one of 'Present', 'Absent', or 'On Leave'.",
      });
    }

    const isEmployee = await Employee.findOne({ email });
    if (!isEmployee) {
      return res.status(404).json({
        error: true,
        message: "Employee not found",
      });
    }

    const todayDate = moment().format("YYYY-MM-DD"); // Format today's date
    const existingAttendance = await Attendance.findOne({
      employeeId: isEmployee._id,
      date: todayDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        error: true,
        message: "Attendance for today has already been marked.",
      });
    }

    const arrivalTime = status === "Present" ? moment().format("YYYY-MM-DD HH:mm") : undefined;

    const newAttendance = new Attendance({
      employeeId: isEmployee._id,
      date: todayDate, // String format
      status: status,
      arrivalTime: arrivalTime,
      departureTime: undefined,
    });

    await newAttendance.save();

    return res.status(201).json({
      error: false,
      message: "Attendance marked successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance: ", error);
    return res.status(500).json({
      error: true,
      message: "Failed to mark attendance. Please try again later.",
    });
  }
});


app.put("/mark-departure", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Get email from authenticated user

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required",
      });
    }

    // Find the employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({
        error: true,
        message: "Employee not found",
      });
    }

    // Get today's date as a formatted string
    const todayDate = moment().format("YYYY-MM-DD");

    // Find the attendance record for today
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: todayDate,
    });

    if (!attendance) {
      return res.status(404).json({
        error: true,
        message: "Attendance for today has not been marked yet",
      });
    }

    console.log("Current departureTime:", attendance.departureTime); // Log the current departure time for debugging

    // Check if the employee is marked as "Present"
    if (attendance.status !== "Present") {
      return res.status(400).json({
        error: true,
        message: "Cannot mark departure time if employee is not present",
      });
    }

    // Check if departure time is set to "undefined" string
    if (attendance.departureTime !== "undefined") {
      return res.status(400).json({
        error: true,
        message: "Departure time is already marked for today",
      });
    }

    // Set the departure time to the current time
    const departureTime = moment().format("YYYY-MM-DD HH:mm");

    // Update the attendance record
    attendance.departureTime = departureTime;
    await attendance.save();

    return res.status(200).json({
      error: false,
      message: "Departure time marked successfully",
      attendance: attendance,
    });
  } catch (error) {
    console.error("Error marking departure time:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to mark departure time. Please try again later.",
    });
  }
});



app.post("/upload-image",upload.single("image"),async(req,res)=>{
  
  try{
    if(!req.file){
      return res.status(400).json({error:true,message:"no image uploaded"});
    }

    const imageUrl=`http://localhost:8000/profilepics/${req.file.filename}`;
    res.status(201).json({imageUrl});


  }catch(error){
        res.status(500).json({error:true,message:error.message});
  }

});

app.use("/profilepics", express.static(path.join(__dirname, "profilepics")));


app.get(
  "/get-all-attendance",
  authenticateToken,
  authorizeRoles(["Admin"]),
  async (req, res) => {
    try {
      // Get the current date in 'YYYY-MM-DD' format for the local timezone
      const today = new Date();

      // Adjust the date to local timezone
      const formattedDate = today.toLocaleDateString("en-CA"); // 'en-CA' returns the date as 'YYYY-MM-DD'

      // Log the formattedDate to verify
      console.log("Formatted Date:", formattedDate); // Debugging step 1

      // Fetch all attendances for today (where the date matches the formatted date)
      const attendances = await Attendance.find({
        date: formattedDate, // Match with the string format stored in the DB
      });

      // Log the attendance data to verify if the query is correct
      console.log("Fetched Attendances:", attendances); // Debugging step 2

      // Calculate the total number of today's attendances
      const totalAttendances = attendances.length;

      // Send successful response
      res.status(200).json({
        error: false,
        attendances,
        totalAttendances, // Include totalAttendances in the response
      });
    } catch (error) {
      console.error("Error fetching attendances:", error);

      // Log the error message
      console.error("Error details:", error); // Debugging step 3

      // Send error response
      res.status(500).json({
        error: true,
        message: "Failed to fetch attendances. Please try again later.",
      });
    }
  }
);






// Middleware to verify JWT

app.post('/apply-leave', authenticateToken, async (req, res) => {
  const { leaveDate, leaveType, reason } = req.body;

  // Extract email from JWT payload
  const { email } = req.user;

  if (!leaveDate || !leaveType || !reason) {
    return res.status(400).json({ error: true, message: 'Leave date, leave type, and reason are required.' });
  }

  try {
    // Fetch employee details using email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ error: true, message: 'Employee not found.' });
    }

    // Create a leave request
    const leave = new Leave({
      email: employee.email, // Employee email
      username: employee.name, // Employee name fetched from database
      leaveDate: new Date(leaveDate),
      leaveType,
      reason, // Add reason to the leave
    });

    await leave.save();

    res.status(201).json({
      error: false,
      message: 'Leave request submitted successfully.',
      leave,
    });
  } catch (error) {
    console.error('Error applying leave:', error);
    res.status(500).json({ error: true, message: 'Failed to apply for leave. Please try again.' });
  }
});



app.put('/approve-leave/:leaveId', authenticateToken, authorizeRoles(["Admin", "Manager"]), async (req, res) => {
  const { leaveId } = req.params;  // Fix: extracting leaveId from params
  const { status } = req.body;

  // Check if the user is authorized (Admin/Manager)
  if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
    return res.status(403).json({ error: true, message: 'You are not authorized to approve or reject leaves.' });
  }

  // Validate the provided status
  if (!['Approved', 'Not Approved'].includes(status)) {
    return res.status(400).json({ error: true, message: 'Invalid status. Status must be "Approved" or "Not Approved".' });
  }

  try {
    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ error: true, message: 'Leave request not found.' });
    }

    leave.status = status; // Update the status based on the request body
    await leave.save();

    res.status(200).json({
      error: false,
      message: `Leave request ${status === 'Approved' ? 'approved' : 'rejected'} successfully.`,
      leave,
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: true, message: 'Failed to update leave status. Please try again.' });
  }
});

app.get('/get-not-approved-leaves', authenticateToken,authorizeRoles(["Admin", "Manager"]), async (req, res) => {
  try {
    // Fetch all leave requests where the status is 'Not Approved' and sort by leaveDate
    const leaves = await Leave.find({ status: 'Not Approved' })
                              .sort({ leaveDate: 1 }); // 1 for ascending order

    if (leaves.length === 0) {
      return res.status(404).json({ error: true, message: 'No leave requests found in Not Approved state.' });
    }

    res.status(200).json({
      error: false,
      message: 'Fetched Not Approved leave requests successfully.',
      leaves,
    });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch Not Approved leave requests. Please try again.' });
  }
});


app.get("/get-applied-leaves", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Extract email from the authenticated user's token

    // Find the user in the Employee collection to get their ID
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Retrieve the leaves applied by the user
    const appliedLeaves = await Leave.find({ email: user.email });

    // Send the applied leaves as a response
    return res.status(200).json({
      error: false,
      leaves: appliedLeaves,
    });
  } catch (error) {
    console.error("Error fetching applied leaves: ", error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch applied leaves. Please try again later.",
    });
  }
});


app.get("/get-count-attendance", authenticateToken, async (req, res) => {
  try {
    // Get today's date as a string
    const today = moment().format("YYYY-MM-DD");

    // Generate the last 5 days as strings in "YYYY-MM-DD" format
    const lastFiveDays = [];
    for (let i = 0; i < 5; i++) {
      lastFiveDays.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
    }

    // Query the attendance collection
    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          date: { $in: lastFiveDays }, // Match attendance dates within the last 5 days
          status: "Present", // Assuming you are counting 'Present' employees
        },
      },
      {
        $group: {
          _id: "$date", // Group by the `date` field
          count: { $sum: 1 }, // Count the number of records for each date
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by date in ascending order
      },
    ]);

    // Map the results to include missing dates with zero attendance
    const attendanceCounts = lastFiveDays.map((day) => {
      const record = attendanceData.find((item) => item._id === day);
      return {
        date: day,
        count: record ? record.count : 0, // Use 0 if no record is found for that date
      };
    });

    // Return the results
    res.status(200).json({ success: true, attendance: attendanceCounts });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get('/leave-count', authenticateToken, authorizeRoles(['Admin', 'Manager']), async (req, res) => {
  try {
    // Get today's date, ignoring time (set to midnight for comparison)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    // Query for leaves with leaveDate equal to today and status 'Approved'
    const leaveCount = await Leave.countDocuments({
      leaveDate: { $gte: startOfDay, $lte: endOfDay },
      status: 'Approved', // Only count approved leaves
    });

    res.json({ leaveCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the leave count.' });
  }
});




 



