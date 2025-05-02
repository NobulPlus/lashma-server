require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
// const fileUpload = require("express-fileupload");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const marketingAgencyRoutes = require("./routes/marketingAgencyRoutes");
const marketingAgentRoutes = require("./routes/marketingAgentRoutes");
const pharmaciesRoutes = require("./routes/pharmacyRoutes");
const providersRoutes = require("./routes/providerRoutes");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Allow cross-origin requests
app.use(morgan("dev")); // Logger for requests
// app.use(fileUpload()); // Enable file uploads
app.use(express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes); // Admin Authentication
app.use("/api/blogs", blogRoutes); // Blog Posts
app.use("/api/marketing-agencies", marketingAgencyRoutes); // Marketing Agencies
app.use("/api/marketing-agents", marketingAgentRoutes); // Marketing Agents
app.use("/api/pharmacies", pharmaciesRoutes); //Pharmacy
app.use("/api/providers", providersRoutes); //Providers

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Lashma Server API 🚀");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
