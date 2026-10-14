
const Complaint = require("../models/Complaint");
const User = require("../models/User");

const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({ student: studentId }),
      Complaint.countDocuments({ student: studentId, status: "PENDING" }),
      Complaint.countDocuments({ student: studentId, status: "IN-PROGRESS" }),
      Complaint.countDocuments({ student: studentId, status: "RESOLVED" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
      },
    });
  } catch (error) {
    console.error("Student dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch student dashboard statistics",
    });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalStudents,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "PENDING" }),
      Complaint.countDocuments({ status: "IN-PROGRESS" }),
      Complaint.countDocuments({ status: "RESOLVED" }),
      User.countDocuments({ role: "student" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalStudents,
      },
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch admin dashboard statistics",
    });
  }
};

module.exports = {
  getStudentDashboardStats,
  getAdminDashboardStats,
};
