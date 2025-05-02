const xlsx = require("xlsx");
const Pharmacy = require("../models/Pharmacy");

// Create Pharmacy
const createPharmacy = async (req, res) => {
  try {
    const { name, address, lga } = req.body;
    const newPharmacy = new Pharmacy({ name, address, lga });
    await newPharmacy.save();
    res.status(201).json(newPharmacy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Pharmacy
const updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, lga } = req.body;
    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      id,
      { name, address, lga },
      { new: true }
    );
    if (!updatedPharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json(updatedPharmacy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Pharmacy
const deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Pharmacy.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Pharmacies
const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Pharmacy
const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUploadPharmacies = async (req, res) => {
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
  
      const formatted = data.map((row) => ({
        name: row.name || row.Name,
        address: row.address || row.Address,
        lga: row.lga || row.LGA,
      }));
  
      const saved = await Pharmacy.insertMany(formatted);
      res.status(201).json({ message: "Pharmacies uploaded successfully", saved });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getAllPharmacies,
  getPharmacyById,
  bulkUploadPharmacies
};
