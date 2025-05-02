const express = require("express");
const {
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getAllPharmacies,
  getPharmacyById,
  bulkUploadPharmacies,
} = require("../controllers/pharmacyController");
const { authMiddleware, verifyMedicalAdmin } = require("../middleware/authMiddleware");
const uploadExcel = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, verifyMedicalAdmin, createPharmacy);
router.post("/bulk-upload", authMiddleware, verifyMedicalAdmin, uploadExcel.single("file"), bulkUploadPharmacies);
router.put("/:id", authMiddleware, verifyMedicalAdmin, updatePharmacy);
router.delete("/:id", authMiddleware, verifyMedicalAdmin, deletePharmacy);
router.get("/", getAllPharmacies);
router.get("/:id", getPharmacyById);

module.exports = router;
