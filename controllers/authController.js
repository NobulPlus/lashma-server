const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// 🚀 Register a New Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || "sales-admin" // Default to "sales-admin" if no role provided
    });

    await newAdmin.save();

    // Generate token immediately after registration (optional)
    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "6h" } // 🔹 Increased expiry to 6 hours
    );

    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token with role included
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "6h" } // 🔹 Increased expiry to 6 hours
    );

    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Get Admin Profile (Protected)
const getAdminProfile = async (req, res) => {
  try {
      // Ensure `req.admin.id` exists
      if (!req.admin || !req.admin.id) {
          return res.status(401).json({ message: "Unauthorized, invalid token" });
      }

      const admin = await Admin.findById(req.admin.id).select("-password");
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      res.json(admin);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminProfile };
