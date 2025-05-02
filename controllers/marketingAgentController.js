const MarketingAgent = require("../models/MarketingAgent");

// Create a Marketing Agent
const createAgent = async (req, res) => {
  try {
    const { name, agency, phone } = req.body;

    const newAgent = new MarketingAgent({ name, agency, phone });
    await newAgent.save();

    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Marketing Agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await MarketingAgent.find().populate("agency");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Marketing Agent
const getAgentById = async (req, res) => {
  try {
    const agent = await MarketingAgent.findById(req.params.id).populate("agency");
    if (!agent) return res.status(404).json({ message: "Marketing Agent not found" });

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Marketing Agent (Admin Only)
const updateAgent = async (req, res) => {
  try {
    const { name, agency, phone } = req.body;
    const updatedAgent = await MarketingAgent.findByIdAndUpdate(
      req.params.id,
      { name, agency, phone },
      { new: true }
    ).populate("agency");

    if (!updatedAgent) return res.status(404).json({ message: "Marketing Agent not found" });

    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Marketing Agent (Admin Only)
const deleteAgent = async (req, res) => {
  try {
    const deletedAgent = await MarketingAgent.findByIdAndDelete(req.params.id);
    if (!deletedAgent) return res.status(404).json({ message: "Marketing Agent not found" });

    res.json({ message: "Marketing Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAgent, getAllAgents, getAgentById, updateAgent, deleteAgent };
