const express = require("express");
const {
  createProvider,
  updateProvider,
  deleteProvider,
  getAllProviders,
  getProviderById,
  bulkUploadProviders,
} = require("../controllers/providerController");
const { authMiddleware, verifyMedicalAdmin } = require("../middleware/authMiddleware");
const uploadExcel = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, verifyMedicalAdmin, createProvider);
router.post("/bulk-upload", authMiddleware, verifyMedicalAdmin, uploadExcel.single("file"), bulkUploadProviders);
router.put("/:id", authMiddleware, verifyMedicalAdmin, updateProvider);
router.delete("/:id", authMiddleware, verifyMedicalAdmin, deleteProvider);
router.get("/", getAllProviders);
router.get("/:id", getProviderById);

module.exports = router;
