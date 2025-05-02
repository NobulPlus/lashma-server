const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  lga: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Pharmacy", pharmacySchema);
