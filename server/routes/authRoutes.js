const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post("/register", registerUser);

// ===============================
// LOGIN
// ===============================
router.post("/login", loginUser);

// ===============================
// GET PROFILE
// ===============================
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// ===============================
// UPDATE PROFILE
// ===============================
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

module.exports = router;