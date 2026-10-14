
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// REGISTER USER
// Public registration creates students only.
// ===============================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      phone,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Validate input types
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input format",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Name and email cannot be empty",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // IMPORTANT:
    // Never trust a role supplied by public registration.
    // Every newly registered account is a student.
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "student",
      studentId:
        typeof studentId === "string" ? studentId.trim() : "",
      department:
        typeof department === "string" && department.trim()
          ? department.trim()
          : "CSE",
      phone:
        typeof phone === "string" ? phone.trim() : "",
    });

    // Generate authentication token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email errors safely
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate authentication token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ===============================
// GET USER PROFILE
// ===============================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// ===============================
// UPDATE USER PROFILE
// ===============================
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      studentId,
      department,
      phone,
    } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    const cleanStudentId =
      typeof studentId === "string" ? studentId.trim() : "";

    const cleanDepartment =
      typeof department === "string" && department.trim()
        ? department.trim()
        : "CSE";

    const cleanPhone =
      typeof phone === "string" ? phone.trim() : "";

    // Check whether another user already has this email
    const existingUser = await User.findOne({
      email: cleanEmail,
      _id: {
        $ne: req.user.id,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered by another user",
      });
    }

    // Update profile without allowing role or password changes
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: cleanName,
          email: cleanEmail,
          studentId: cleanStudentId,
          department: cleanDepartment,
          phone: cleanPhone,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered by another user",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
