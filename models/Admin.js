const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { 
    type: String, 
    enum: ["super-admin", "blog-admin", "sales-admin", "medical-admin"], 
    default: "sales-admin"
  }
});

module.exports = mongoose.model("Admin", adminSchema);
