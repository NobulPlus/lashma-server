const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
// const { authMiddleware} = require("../controllers/middleware/authMiddleware")
const {registerAdmin, loginAdmin, getAdminProfile} = require("../controllers/authController");

const router = express.Router();

// Register a New Admin
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginAdmin);

// Get Admin Profile (Protected)
router.get("/profile", authMiddleware, getAdminProfile);

module.exports = router;
