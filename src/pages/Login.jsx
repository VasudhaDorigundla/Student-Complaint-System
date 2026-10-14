import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const { token, user } = response.data;

      // Make sure selected login role matches backend role
      if (user.role !== role) {
        setLoading(false);

        setError(
          `This account is registered as ${user.role}. Please select ${user.role} login.`
        );

        return;
      }

      // Remove old session
      localStorage.removeItem("campuscareCurrentUser");
      localStorage.removeItem("campuscareToken");

      // Save JWT token
      localStorage.setItem("campuscareToken", token);

      // Save logged-in user
      localStorage.setItem(
        "campuscareCurrentUser",
        JSON.stringify(user)
      );

      setLoading(false);

      // Navigate according to role
      if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/student/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      setLoading(false);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else {
        setError(
          "Unable to connect to CampusCare server."
        );
      }
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <div className="login-brand">

          <div className="login-brand-logo">
            C
          </div>

          <div>
            <strong>CampusCare</strong>
            <span>Grievance Portal</span>
          </div>

        </div>

        <div className="login-hero">

          <div className="login-hero-icon">
            <ShieldCheck size={30} />
          </div>

          <h1>
            Your Voice.
            <br />
            Our Responsibility.
          </h1>

          <p>
            A simple and transparent platform for
            students to raise complaints and track
            their resolution.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <div className="login-card-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to your CampusCare account
            </p>

          </div>

          {/* ROLE SELECTOR */}

          <div className="login-role-selector">

            <button
              type="button"
              className={
                role === "student"
                  ? "login-role active"
                  : "login-role"
              }
              onClick={() => {
                setRole("student");
                setError("");
              }}
            >
              <UserRound size={18} />

              <span>
                Student
              </span>
            </button>

            <button
              type="button"
              className={
                role === "admin"
                  ? "login-role active"
                  : "login-role"
              }
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              <ShieldCheck size={18} />

              <span>
                Admin
              </span>
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="login-field">

              <label>
                Email Address
              </label>

              <div className="login-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder={
                    role === "admin"
                      ? "admin@campuscare.com"
                      : "Enter your email"
                  }
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <label>
                Password
              </label>

              <div className="login-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
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

            </div>

            {/* LOGIN */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : `Sign in as ${
                    role === "admin"
                      ? "Admin"
                      : "Student"
                  }`}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>

          {/* REGISTER */}

          {role === "student" && (

            <div className="login-register">

              Don't have an account?

              <Link to="/register">
                Create account
              </Link>

            </div>

          )}

          {/* ADMIN DEMO DETAILS */}

          {role === "admin" && (

            <div className="login-demo">

              <strong>
                Admin Demo Account
              </strong>

              <span>
                Email: admin@campuscare.com
              </span>

              <span>
                Password: admin123
              </span>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Login;