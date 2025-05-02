const xlsx = require("xlsx");
const MarketingAgency = require("../models/MarketingAgency");


// Create Agency
const createAgency = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const newAgency = new MarketingAgency({ name, phoneNumber });
    await newAgency.save();
    res.status(201).json(newAgency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Agencies
const getAllAgencies = async (req, res) => {
  try {
    const agencies = await MarketingAgency.find();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Agency
const getAgencyById = async (req, res) => {
  try {
    const agency = await MarketingAgency.findById(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Agency
const deleteAgency = async (req, res) => {
  try {
    const deletedAgency = await MarketingAgency.findByIdAndDelete(req.params.id);
    if (!deletedAgency) return res.status(404).json({ message: "Agency not found" });

    res.json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUploadAgencies = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const formatted = data.map((row) => ({
      name: row.name || row.Name,
      phone: row.phone || row.Phone,
    }));

    const saved = await MarketingAgency.insertMany(formatted);
    res.status(201).json({ message: "Bulk upload successful", saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAgency, getAllAgencies, getAgencyById, deleteAgency, bulkUploadAgencies };
