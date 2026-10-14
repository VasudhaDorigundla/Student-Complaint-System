
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ==========================================
// HELPER - SEND NOTIFICATION TO ADMINS
// ==========================================
const notifyAdmins = async ({
  title,
  message,
  type,
  complaintId = null,
  excludeUserId = null,
}) => {
  try {
    const query = { role: "admin" };

    // Avoid notifying the admin who performed the action.
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }

    const admins = await User.find(query).select("_id");

    if (admins.length === 0) {
      return;
    }

    await Notification.insertMany(
      admins.map((admin) => ({
        user: admin._id,
        title,
        message,
        type,
        complaint: complaintId,
        read: false,
      }))
    );

    console.log(`Admin notification created: ${title}`);
  } catch (error) {
    console.error("Admin notification error:", error.message);
  }
};

// ==========================================
// STUDENT - SUBMIT COMPLAINT
// ==========================================
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      priority,
      description,
    } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, category, location and description are required",
      });
    }

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ];

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint priority",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const complaint = await Complaint.create({
      student: user._id,
      studentName: user.name,
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      priority: priority || "Medium",
      description: description.trim(),
    });

    // Notify admins about every new complaint.
    const isHighPriority = ["High", "Urgent"].includes(
      complaint.priority
    );

    await notifyAdmins({
      title: isHighPriority
        ? `${complaint.priority} Priority Complaint`
        : "New Complaint Submitted",
      message: isHighPriority
        ? `${user.name} submitted a ${complaint.priority.toLowerCase()}-priority complaint: "${complaint.title}". Please review it promptly.`
        : `${user.name} submitted a new complaint: "${complaint.title}".`,
      type: isHighPriority
        ? "URGENT_COMPLAINT"
        : "NEW_COMPLAINT",
      complaintId: complaint._id,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting complaint",
    });
  }
};

// ==========================================
// STUDENT - GET MY COMPLAINTS
// ==========================================
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT
// ==========================================
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (
      req.user.role === "student" &&
      complaint.student.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this complaint",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaint",
    });
  }
};

// ==========================================
// ADMIN - GET ALL COMPLAINTS
// ==========================================
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email studentId department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching all complaints",
    });
  }
};

// ==========================================
// ADMIN - UPDATE COMPLAINT
// CREATES STUDENT AND ADMIN NOTIFICATIONS
// ==========================================
const updateComplaint = async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const previousStatus = complaint.status;
    const previousResolution = complaint.resolution;

    if (status !== undefined) {
      const allowedStatuses = [
        "PENDING",
        "IN-PROGRESS",
        "RESOLVED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status",
        });
      }

      complaint.status = status;
    }

    if (resolution !== undefined) {
      if (typeof resolution !== "string") {
        return res.status(400).json({
          success: false,
          message: "Resolution must be text",
        });
      }

      complaint.resolution = resolution.trim();
    }

    const statusChanged = previousStatus !== complaint.status;
    const resolutionChanged =
      previousResolution !== complaint.resolution;

    await complaint.save();

    if (statusChanged || resolutionChanged) {
      const readableStatus = {
        PENDING: "Pending",
        "IN-PROGRESS": "In Progress",
        RESOLVED: "Resolved",
      };

      let notificationTitle = "";
      let notificationMessage = "";
      let notificationType = "STATUS_UPDATE";

      if (statusChanged) {
        if (complaint.status === "RESOLVED") {
          notificationTitle = "Complaint Resolved";
          notificationType = "RESOLUTION";

          notificationMessage =
            `Your complaint "${complaint.title}" has been resolved.`;

          if (complaint.resolution) {
            notificationMessage +=
              ` Admin response: ${complaint.resolution}`;
          }
        } else {
          notificationTitle = "Complaint Status Updated";

          notificationMessage =
            `Your complaint "${complaint.title}" is now ` +
            `${readableStatus[complaint.status]}.`;

          if (resolutionChanged && complaint.resolution) {
            notificationMessage +=
              ` Admin response: ${complaint.resolution}`;
          }
        }
      } else if (resolutionChanged) {
        notificationTitle = "Admin Response Updated";
        notificationType = "RESOLUTION";

        notificationMessage = complaint.resolution
          ? `The admin updated the response for your complaint "${complaint.title}": ${complaint.resolution}`
          : `The admin cleared the resolution for your complaint "${complaint.title}".`;
      }

      // Preserve the existing student notification.
      try {
        await Notification.create({
          user: complaint.student,
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
          complaint: complaint._id,
          read: false,
        });
      } catch (notificationError) {
        console.error(
          "Student notification creation failed:",
          notificationError.message
        );
      }

      // Notify other admins when a complaint is resolved.
      // The admin performing the update is excluded.
      if (
        statusChanged &&
        complaint.status === "RESOLVED"
      ) {
        await notifyAdmins({
          title: "Complaint Resolved",
          message:
            `Complaint "${complaint.title}" submitted by ` +
            `${complaint.studentName} has been resolved.`,
          type: "RESOLUTION",
          complaintId: complaint._id,
          excludeUserId: req.user.id,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating complaint",
    });
  }
};

// ==========================================
// ADMIN - DELETE COMPLAINT
// ==========================================
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting complaint",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
};