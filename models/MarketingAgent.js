const mongoose = require("mongoose");

const marketingAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marketingAgency: { type: mongoose.Schema.Types.ObjectId, ref: "MarketingAgency", required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("MarketingAgent", marketingAgentSchema);
