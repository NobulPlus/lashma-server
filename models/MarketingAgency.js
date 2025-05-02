const mongoose = require("mongoose");

const MarketingAgencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketingAgency", MarketingAgencySchema);
