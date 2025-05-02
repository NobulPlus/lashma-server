const Blog = require("../models/Blog");
const path = require("path");
const fs = require("fs");

// 🚀 Create a Blog Post (Admin Only)
const createBlog = async (req, res) => {
  try {
    console.log("🔥 Request body:", req.body);
    console.log("🔥 Uploaded file:", req.file); // Check this

    if (!req.file) {
      console.log("❌ No file uploaded!");
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newBlog = new Blog({
      title,
      content,
      image: req.file.filename,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Get All Blog Posts (Partial Content)
const getAllBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit (all blogs)
    let query = Blog.find()
      .select("title content image createdAt")
      .sort({ createdAt: -1 }); // Sort by latest first

    if (limit > 0) {
      query = query.limit(limit); // Apply limit if specified
    }

    const blogs = await query;

    const limitedBlogs = blogs.map((blog) => ({
      ...blog._doc,
      content: blog.content.length > 100 
        ? blog.content.substring(0, 100) + "..." 
        : blog.content,
      image: `${req.protocol}://${req.get("host")}/${blog.image}` // Full URL
    }));

    res.json(limitedBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Get Single Blog Post
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const blogWithUrl = {
      ...blog._doc,
      image: `${req.protocol}://${req.get("host")}/${blog.image}` // Full URL
    };

    res.json(blogWithUrl);
  } catch (error) {
    if (error.name === "CastError") { // Handle invalid ID format
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Update Blog Post (Admin Only)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete old image if new one is uploaded
    if (req.file) {
      const oldImagePath = path.join(__dirname, "../Uploads", blog.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
    }

    const updateData = {
      title: req.body.title || blog.title, // Keep existing if not provided
      content: req.body.content || blog.content,
      image: req.file ? req.file.filename : blog.image
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return updated document
    );

    const blogWithUrl = {
      ...updatedBlog._doc,
      image: `${req.protocol}://${req.get("host")}/${updatedBlog.image}` // Full URL
    };

    res.json(blogWithUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Delete Blog Post (Admin Only)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image file
    const imagePath = path.join(__dirname, "../Uploads", blog.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image:", err);
    });

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};