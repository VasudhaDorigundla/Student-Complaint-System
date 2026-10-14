
const express = require("express");

const {
  getStudentDashboardStats,
  getAdminDashboardStats,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Student sees only their own complaint statistics.
router.get(
  "/student",
  authMiddleware,
  getStudentDashboardStats
);

// Only an authenticated admin can see system-wide statistics.
router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminDashboardStats
);

module.exports = router;
