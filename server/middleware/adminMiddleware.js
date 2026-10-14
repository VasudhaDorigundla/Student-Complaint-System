
// ===============================
// ADMIN AUTHORIZATION MIDDLEWARE
// ===============================
const adminMiddleware = (req, res, next) => {
  // Authentication middleware must run first.
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Only authenticated administrators can continue.
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin access required.",
    });
  }

  next();
};

module.exports = adminMiddleware;
