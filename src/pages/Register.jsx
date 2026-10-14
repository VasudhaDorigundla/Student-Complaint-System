import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanStudentId = form.studentId.trim();
    const cleanDepartment = form.department;

    // Validation
    if (
      !cleanName ||
      !cleanEmail ||
      !cleanStudentId ||
      !cleanDepartment ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Send registration data to backend
      const response = await api.post("/auth/register", {
        name: cleanName,
        email: cleanEmail,
        studentId: cleanStudentId,
        department: cleanDepartment,
        password: form.password,
        role: "student",
      });

      console.log("Registration successful:", response.data);

      setLoading(false);

      // Go to login after successful registration
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Registration error:", error);

      setLoading(false);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Unable to create account."
        );
      } else {
        setError(
          "Unable to connect to CampusCare server."
        );
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">

        <Link to="/" className="auth-logo">
          <div className="logo-icon">C</div>

          <div>
            <strong>CampusCare</strong>
            <span>Grievance Portal</span>
          </div>
        </Link>

        <div className="auth-hero">

          <div className="auth-icon">
            <UserPlus size={30} />
          </div>

          <h1>
            Join the
            <br />
            <span>CampusCare community.</span>
          </h1>

          <p>
            Create your account and make it easier to communicate
            campus concerns with your administration.
          </p>

          <div className="auth-points">
            <div>✓ Report campus issues</div>
            <div>✓ Track every complaint</div>
            <div>✓ Get transparent updates</div>
          </div>

        </div>
      </div>

      <div className="auth-right">

        <div className="auth-card register-card">

          <div className="auth-card-header">

            <span>GET STARTED</span>

            <h2>Create your account</h2>

            <p>
              Register as a CampusCare student.
            </p>

          </div>

          <form onSubmit={handleRegister}>

            <div className="form-grid">

              <div>
                <label>Full Name</label>

                <input
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Student ID</label>

                <input
                  name="studentId"
                  placeholder="Student ID"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Department</label>

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">
                Select department
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="EEE">
                EEE
              </option>

              <option value="MECH">
                MECH
              </option>

              <option value="CIVIL">
                CIVIL
              </option>

              <option value="AI & ML">
                AI & ML
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <label>Password</label>

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

          <div className="auth-footer">
            Already have an account?

            <Link to="/login">
              Sign in
            </Link>
          </div>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Register;