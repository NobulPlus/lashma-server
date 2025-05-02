const express = require("express");
const { authMiddleware, verifySalesAdmin } = require("../middleware/authMiddleware");
const {
  createAgency,
  getAllAgencies,
  getAgencyById,
  deleteAgency,
  bulkUploadAgencies
} = require("../controllers/marketingAgencyController");
const uploadExcel = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, verifySalesAdmin, createAgency);
router.post("/bulk-upload", authMiddleware, verifySalesAdmin, uploadExcel.single("file"), bulkUploadAgencies);
router.delete("/:id", authMiddleware, verifySalesAdmin, deleteAgency);
router.get("/", getAllAgencies);
router.get("/:id", getAgencyById);

module.exports = router;
