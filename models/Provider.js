const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  lga: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Provider", providerSchema);
