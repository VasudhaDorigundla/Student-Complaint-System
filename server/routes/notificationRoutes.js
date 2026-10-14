
const express = require("express");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications
router.get("/", authMiddleware, getMyNotifications);

// Get unread notification count
router.get("/unread-count", authMiddleware, getUnreadCount);

// Mark all notifications as read
router.put("/read-all", authMiddleware, markAllAsRead);

// Mark one notification as read
router.put("/:id/read", authMiddleware, markAsRead);

module.exports = router;
