const express = require("express");
const { authMiddleware, verifySalesAdmin } = require("../middleware/authMiddleware");
const {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../controllers/marketingAgentController");

const router = express.Router();

router.post("/", authMiddleware, verifySalesAdmin, createAgent);
router.get("/", getAllAgents);
router.get("/:id", getAgentById);
router.put("/:id", authMiddleware, updateAgent);
router.delete("/:id", authMiddleware, deleteAgent);

module.exports = router;
