const multer = require("multer");
const path = require("path");

// Storage configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./profilepics/"); // Destination folder for storing files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only images are allowed"), false); // Reject the file
    }
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;