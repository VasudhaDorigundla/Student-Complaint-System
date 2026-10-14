const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// STUDENT ROUTES
// ==========================================

router.post("/", authMiddleware, createComplaint);

router.get("/my", authMiddleware, getMyComplaints);

router.get("/:id", authMiddleware, getComplaintById);


// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllComplaints
);

router.put(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  updateComplaint
);

router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  deleteComplaint
);

module.exports = router;