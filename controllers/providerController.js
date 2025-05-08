const xlsx = require("xlsx");
const Provider = require("../models/Provider");
const fs = require("fs").promises;

// Create Provider
const createProvider = async (req, res) => {
  try {
    const { name, address, lga } = req.body;
    if (!name || !address || !lga) {
      return res.status(400).json({ message: "Name, address, and LGA are required" });
    }
    const newProvider = new Provider({ name, address, lga });
    await newProvider.save();
    res.status(201).json(newProvider);
  } catch (error) {
    console.error("Create provider error:", error);
    res.status(500).json({ message: "Failed to create provider", error: error.message });
  }
};

// Update Provider
const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, lga } = req.body;
    if (!name || !address || !lga) {
      return res.status(400).json({ message: "Name, address, and LGA are required" });
    }
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
    console.error("Update provider error:", error);
    res.status(500).json({ message: "Failed to update provider", error: error.message });
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
    console.error("Delete provider error:", error);
    res.status(500).json({ message: "Failed to delete provider", error: error.message });
  }
};

// Get All Providers
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (error) {
    console.error("Get all providers error:", error);
    res.status(500).json({ message: "Failed to fetch providers", error: error.message });
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
    console.error("Get provider by ID error:", error);
    res.status(500).json({ message: "Failed to fetch provider", error: error.message });
  }
};

// Bulk Upload Providers
const bulkUploadProviders = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const formatted = data.map((row) => {
      const provider = {
        name: row.name || row.Name,
        address: row.address || row.Address,
        lga: row.lga || row.LGA,
      };
      if (!provider.name || !provider.address || !provider.lga) {
        throw new Error(`Invalid row: ${JSON.stringify(row)}`);
      }
      return provider;
    });

    const saved = await Provider.insertMany(formatted);
    await fs.unlink(req.file.path); // Clean up uploaded file
    res.status(201).json({ message: "Providers uploaded successfully", count: saved.length });
  } catch (error) {
    console.error("Bulk upload error:", error);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ message: "Failed to upload providers", error: error.message });
  }
};

module.exports = {
  createProvider,
  updateProvider,
  deleteProvider,
  getAllProviders,
  getProviderById,
  bulkUploadProviders,
};