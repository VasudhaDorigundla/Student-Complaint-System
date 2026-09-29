import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.studentId ||
      !form.department ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem("campuscareUsers") || "[]"
    );

    const alreadyExists = existingUsers.some(
      (user) => user.email === form.email
    );

    if (alreadyExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      studentId: form.studentId,
      department: form.department,
      password: form.password,
      role: "student",
    };

    localStorage.setItem(
      "campuscareUsers",
      JSON.stringify([...existingUsers, newUser])
    );

    localStorage.setItem(
      "campuscareCurrentUser",
      JSON.stringify(newUser)
    );

    navigate("/student/dashboard");
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
            <p>Register as a CampusCare student.</p>
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
                />
              </div>

              <div>
                <label>Student ID</label>
                <input
                  name="studentId"
                  placeholder="Student ID"
                  value={form.studentId}
                  onChange={handleChange}
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
            />

            <label>Department</label>

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option value="">Select department</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>MECH</option>
              <option>CIVIL</option>
              <option>AI & ML</option>
              <option>Other</option>
            </select>

            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit">
              Create Account
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;