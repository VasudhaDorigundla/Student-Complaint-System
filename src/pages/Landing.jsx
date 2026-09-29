import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Clock3,
  ShieldCheck,
  BarChart3,
  FileText,
  Users,
  Building2,
} from "lucide-react";

function Landing() {
  const features = [
    {
      icon: <MessageSquare size={22} />,
      title: "Easy Complaint Submission",
      text: "Report campus problems quickly with a simple and organized complaint form.",
    },
    {
      icon: <Clock3 size={22} />,
      title: "Complaint Tracking",
      text: "Track your complaint from submission to final resolution in one place.",
    },
    {
      icon: <CheckCircle size={22} />,
      title: "Transparent Resolution",
      text: "Stay informed about administrator responses and resolution updates.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Secure Access",
      text: "Separate student and administrator access keeps the platform organized.",
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Smart Administration",
      text: "Administrators can manage and resolve campus complaints efficiently.",
    },
    {
      icon: <Building2 size={22} />,
      title: "Campus Categories",
      text: "Organize complaints across hostels, labs, transport, internet and more.",
    },
  ];

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="nav-container">

          <Link to="/" className="logo">

            <div className="logo-icon">
              C
            </div>

            <div>
              <h2>CampusCare</h2>
              <span>Grievance Portal</span>
            </div>

          </Link>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </div>

          <div className="nav-buttons">

            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Get Started
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section" id="home">

        <div className="hero-container">

          {/* LEFT SIDE */}

          <div className="hero-content">

            <div className="hero-badge">
              <CheckCircle size={15} />
              Smart Campus Grievance Platform
            </div>

            <h1>
              Your Voice.
              <br />
              <span>Our Responsibility.</span>
            </h1>

            <p>
              Report campus issues, track your complaints, and stay
              informed until your concern is resolved.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="primary-btn"
              >
                Submit a Complaint
                <ArrowRight size={17} />
              </Link>

              <a
                href="#how-it-works"
                className="secondary-btn"
              >
                Explore CampusCare
              </a>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <CheckCircle size={16} />
                Easy to use
              </div>

              <div className="trust-item">
                <ShieldCheck size={16} />
                Secure
              </div>

              <div className="trust-item">
                <Clock3 size={16} />
                Track anytime
              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="hero-visual">

            <div className="dashboard-card">

              <div className="dashboard-top">

                <div>
                  <small>Student Dashboard</small>

                  <h3>
                    Welcome back 👋
                  </h3>
                </div>

                <div className="profile-circle">
                  V
                </div>

              </div>


              {/* DASHBOARD STATS */}

              <div className="dashboard-stats">

                <div>
                  <span>Total</span>
                  <strong>12</strong>
                </div>

                <div>
                  <span>Pending</span>
                  <strong>04</strong>
                </div>

                <div>
                  <span>Resolved</span>
                  <strong>08</strong>
                </div>

              </div>


              {/* COMPLAINT */}

              <div className="dashboard-complaint">

                <div className="complaint-heading">

                  <div className="complaint-symbol">
                    <MessageSquare size={17} />
                  </div>

                  <span className="progress-badge">
                    In Progress
                  </span>

                </div>

                <h4>
                  Internet connectivity issue
                </h4>

                <p>
                  Computer laboratory internet connection
                  is unstable.
                </p>

                <div className="progress">
                  <div></div>
                </div>

                <small>
                  Complaint ID: CMP-1024
                </small>

              </div>


              {/* ACTIVITY */}

              <div className="dashboard-row">

                <div className="mini-icon">
                  <CheckCircle size={16} />
                </div>

                <div>
                  <strong>
                    Complaint submitted
                  </strong>

                  <small>
                    Today, 10:32 AM
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="stats-container">

          <div className="stat-box">
            <strong>500+</strong>
            <span>Students Served</span>
          </div>

          <div className="stat-box">
            <strong>1,200+</strong>
            <span>Complaints Managed</span>
          </div>

          <div className="stat-box">
            <strong>95%</strong>
            <span>Resolution Rate</span>
          </div>

          <div className="stat-box">
            <strong>24/7</strong>
            <span>Complaint Tracking</span>
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>POWERFUL FEATURES</span>

          <h2>
            Everything You Need
            <br />
            for a Better Campus
          </h2>

          <p>
            CampusCare makes communication between students
            and administration simple, transparent, and organized.
          </p>

        </div>


        <div className="features-grid">

          {features.map((feature, index) => (

            <div
              className="feature-card"
              key={index}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

              <div className="feature-link">
                Learn more
                <ArrowRight size={14} />
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Solving Campus Problems
            <br />
            Made Simple
          </h2>

          <p>
            Submit your concern and follow its progress
            through every stage of the resolution process.
          </p>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <FileText size={23} />

            <h3>
              Submit
            </h3>

            <p>
              Tell us about your campus issue using
              the complaint form.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <Users size={23} />

            <h3>
              Review
            </h3>

            <p>
              The administrator reviews and categorizes
              your complaint.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <Clock3 size={23} />

            <h3>
              Track
            </h3>

            <p>
              Follow your complaint status directly
              from your dashboard.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <CheckCircle size={23} />

            <h3>
              Resolve
            </h3>

            <p>
              Receive the resolution once your
              complaint is completed.
            </p>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-box">

          <div>

            <span>
              ABOUT CAMPUSCARE
            </span>

            <h2>
              Building a better
              <br />
              campus together.
            </h2>

          </div>

          <p>
            CampusCare provides a centralized platform where
            students can communicate their concerns and
            administrators can efficiently manage campus
            grievances.
          </p>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="cta-box">

          <div>

            <span>
              MAKE YOUR VOICE HEARD
            </span>

            <h2>
              Have a campus concern?
            </h2>

            <p>
              Submit your complaint and let CampusCare
              help you get it resolved.
            </p>

          </div>

          <Link
            to="/register"
            className="cta-button"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-container">

          <div>

            <div className="footer-logo">

              <div className="logo-icon">
                C
              </div>

              <strong>
                CampusCare
              </strong>

            </div>

            <p>
              Your Voice. Our Responsibility.
            </p>

          </div>


          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <a href="#about">
              About
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          © 2026 CampusCare.
          Student Grievance Management System.

        </div>

      </footer>

    </div>
  );
}

export default Landing;