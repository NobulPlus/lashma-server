const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware, verifyBlogAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, or JPG files are allowed!"), false);
    }
    cb(null, true);
  },
  preservePath: true, // Ensure Multer handles empty file inputs
});


// Handle Multer errors gracefully
const handleFileUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error: " + err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Routes
router.post(
  "/",
  upload.single("image"), // Process file upload FIRST
  handleFileUploadErrors, // Handle Multer errors
  authMiddleware, // Authenticate user
  verifyBlogAdmin, // Verify admin role
  createBlog // Controller
);

router.put(
  "/:id",
  upload.single("image"), // Process file upload FIRST
  handleFileUploadErrors, // Handle Multer errors
  authMiddleware,
  verifyBlogAdmin,
  updateBlog
);

router.delete("/:id", authMiddleware, verifyBlogAdmin, deleteBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

module.exports = router;