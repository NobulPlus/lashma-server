const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"], // Add validation for robustness
  },
  content: {
    type: String,
    required: [true, "Content is required"], // Add validation
  },
  image: {
    type: String,
    required: [true, "Image is required"], // Reflect requirement in model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);