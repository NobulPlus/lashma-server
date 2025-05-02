const xlsx = require("xlsx");
const Provider = require("../models/Provider");

// Create Provider
const createProvider = async (req, res) => {
  try {
    const { name, address, lga } = req.body;
    const newProvider = new Provider({ name, address, lga });
    await newProvider.save();
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Provider
const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, lga } = req.body;
    const updatedProvider = await Provider.findByIdAndUpdate(
      id,
      { name, address, lga },
      { new: true }
    );
    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(updatedProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Provider
const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Provider.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json({ message: "Provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Providers
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Provider
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUploadProviders = async (req, res) => {
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
  
      const formatted = data.map((row) => ({
        name: row.name || row.Name,
        address: row.address || row.Address,
        lga: row.lga || row.LGA,
      }));
  
      const saved = await Provider.insertMany(formatted);
      res.status(201).json({ message: "Providers uploaded successfully", saved });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
  createProvider,
  updateProvider,
  deleteProvider,
  getAllProviders,
  getProviderById,
  bulkUploadProviders
};
