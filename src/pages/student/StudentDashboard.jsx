import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Clock3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "student") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const allComplaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    const studentComplaints = allComplaints.filter(
      (complaint) =>
        complaint.studentEmail === currentUser.email ||
        complaint.studentId === currentUser.studentId
    );

    setComplaints(studentComplaints);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) =>
      c.status === "In Progress" ||
      c.status === "IN-PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (c) =>
      c.status === "Resolved" ||
      c.status === "RESOLVED"
  ).length;

  const filteredComplaints = complaints.filter((complaint) =>
    `${complaint.title} ${complaint.category} ${complaint.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const recentComplaints = filteredComplaints.slice(0, 4);

  const getStatusClass = (status) => {
    if (status === "Resolved" || status === "RESOLVED") {
      return "color-status resolved";
    }

    if (
      status === "In Progress" ||
      status === "IN-PROGRESS"
    ) {
      return "color-status progress";
    }

    return "color-status pending";
  };

  const getStatusIcon = (status) => {
    if (status === "Resolved" || status === "RESOLVED") {
      return <CheckCircle2 size={15} />;
    }

    if (
      status === "In Progress" ||
      status === "IN-PROGRESS"
    ) {
      return <RefreshCw size={15} />;
    }

    return <Clock3 size={15} />;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (!user) return null;

  return (
    <div className="color-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="color-sidebar">

        <div className="color-brand">
          <div className="color-brand-icon">
            C
          </div>

          <div>
            <h2>CampusCare</h2>
            <span>Grievance Portal</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="color-nav">

          <Link
            to="/student/dashboard"
            className="color-nav-link active"
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/student/submit-complaint"
            className="color-nav-link"
          >
            <PlusCircle size={19} />
            <span>Submit Complaint</span>
          </Link>

          <Link
            to="/student/my-complaints"
            className="color-nav-link"
          >
            <FileText size={19} />
            <span>My Complaints</span>
          </Link>

          <Link
            to="/student/profile"
            className="color-nav-link"
          >
            <User size={19} />
            <span>My Profile</span>
          </Link>

          {/* NOTIFICATIONS */}
          <Link
            to="/notifications"
            className="color-nav-link"
          >
            <Bell size={19} />
            <span>Notifications</span>
          </Link>

        </nav>

        <div className="sidebar-help-card">
          <div className="help-icon">
            <Sparkles size={20} />
          </div>

          <strong>Need Help?</strong>

          <p>
            Submit your concern and track it
            until it gets resolved.
          </p>

          <Link to="/student/submit-complaint">
            Report an issue
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="color-sidebar-bottom">

          <div className="color-user-mini">

            <div className="color-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>Student</span>
            </div>

          </div>

          <button
            className="color-logout"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="color-main">

        {/* TOP NAVBAR */}

        <header className="color-topbar">

          <div className="topbar-title">
            <span>STUDENT PORTAL</span>
            <h3>Dashboard</h3>
          </div>

          <div className="topbar-right">

            <div className="dashboard-search">
              <Search size={17} />

              <input
                placeholder="Search complaints..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* CLICKABLE NOTIFICATION BELL */}
            <Link
              to="/notifications"
              className="notification-btn"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span></span>
            </Link>

            <div className="topbar-profile">

              <div className="topbar-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>{user.department || "CSE"}</span>
              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="color-content">

          {/* WELCOME BANNER */}

          <div className="color-welcome">

            <div className="welcome-content">

              <div className="welcome-tag">
                <Sparkles size={15} />
                CampusCare Student Portal
              </div>

              <h1>
                {getGreeting()}, {user.name?.split(" ")[0]}!
                <br />
                <span>Your voice matters.</span>
              </h1>

              <p>
                Keep track of your campus concerns,
                submit new complaints, and stay updated
                on every resolution.
              </p>

              <Link
                to="/student/submit-complaint"
                className="welcome-button"
              >
                <PlusCircle size={18} />
                Submit New Complaint
                <ArrowUpRight size={17} />
              </Link>

            </div>

            <div className="welcome-visual">

              <div className="floating-circle circle-one">
                <MessageSquare size={24} />
              </div>

              <div className="floating-circle circle-two">
                <CheckCircle2 size={21} />
              </div>

              <div className="welcome-main-icon">
                <span>C</span>
              </div>

              <div className="floating-circle circle-three">
                <Bell size={20} />
              </div>

            </div>

          </div>

          {/* STAT CARDS */}

          <div className="color-stat-grid">

            <div className="color-stat-card blue-card">

              <div className="stat-card-icon">
                <FileText size={23} />
              </div>

              <div className="stat-card-info">
                <span>Total Complaints</span>
                <strong>{complaints.length}</strong>
                <small>
                  All submitted complaints
                </small>
              </div>

              <div className="stat-decoration">
                <FileText size={75} />
              </div>

            </div>

            <div className="color-stat-card orange-card">

              <div className="stat-card-icon">
                <Clock3 size={23} />
              </div>

              <div className="stat-card-info">
                <span>Pending</span>
                <strong>{pending}</strong>
                <small>
                  Waiting for review
                </small>
              </div>

              <div className="stat-decoration">
                <Clock3 size={75} />
              </div>

            </div>

            <div className="color-stat-card purple-card">

              <div className="stat-card-icon">
                <RefreshCw size={23} />
              </div>

              <div className="stat-card-info">
                <span>In Progress</span>
                <strong>{inProgress}</strong>
                <small>
                  Currently being handled
                </small>
              </div>

              <div className="stat-decoration">
                <RefreshCw size={75} />
              </div>

            </div>

            <div className="color-stat-card green-card">

              <div className="stat-card-icon">
                <CheckCircle2 size={23} />
              </div>

              <div className="stat-card-info">
                <span>Resolved</span>
                <strong>{resolved}</strong>
                <small>
                  Successfully completed
                </small>
              </div>

              <div className="stat-decoration">
                <CheckCircle2 size={75} />
              </div>

            </div>

          </div>

          {/* MAIN GRID */}

          <div className="color-dashboard-grid">

            {/* RECENT COMPLAINTS */}

            <div className="color-panel complaints-panel">

              <div className="color-panel-header">

                <div>
                  <span>ACTIVITY</span>
                  <h2>Recent Complaints</h2>
                </div>

                <Link to="/student/my-complaints">
                  View All
                  <ChevronRight size={16} />
                </Link>

              </div>

              {recentComplaints.length === 0 ? (

                <div className="color-empty">

                  <div>
                    <MessageSquare size={25} />
                  </div>

                  <h3>No complaints yet</h3>

                  <p>
                    Your submitted complaints
                    will appear here.
                  </p>

                  <Link to="/student/submit-complaint">
                    Submit your first complaint
                    <ArrowUpRight size={15} />
                  </Link>

                </div>

              ) : (

                <div className="color-complaint-list">

                  {recentComplaints.map((complaint) => (

                    <Link
                      key={complaint.id}
                      to={`/student/complaint-details/${complaint.id}`}
                      className="color-complaint-item"
                    >

                      <div className="complaint-color-icon">
                        <MessageSquare size={19} />
                      </div>

                      <div className="complaint-main">

                        <div className="complaint-title-row">

                          <h3>
                            {complaint.title ||
                              "Campus Complaint"}
                          </h3>

                          <div
                            className={getStatusClass(
                              complaint.status
                            )}
                          >
                            {getStatusIcon(
                              complaint.status
                            )}

                            {complaint.status ||
                              "Pending"}
                          </div>

                        </div>

                        <div className="complaint-meta">

                          <span>
                            <FileText size={13} />
                            {complaint.category ||
                              "General"}
                          </span>

                          {complaint.location && (
                            <span>
                              <MapPin size={13} />
                              {complaint.location}
                            </span>
                          )}

                          <span>
                            <Clock3 size={13} />
                            {complaint.date ||
                              "Recently"}
                          </span>

                        </div>

                      </div>

                      <ChevronRight
                        size={19}
                        className="complaint-arrow"
                      />

                    </Link>

                  ))}

                </div>

              )}

            </div>

            {/* QUICK ACTIONS */}

            <div className="color-panel actions-panel">

              <div className="color-panel-header">

                <div>
                  <span>SHORTCUTS</span>
                  <h2>Quick Actions</h2>
                </div>

              </div>

              <div className="color-actions">

                <Link
                  to="/student/submit-complaint"
                  className="color-action action-purple"
                >
                  <div>
                    <PlusCircle size={22} />
                  </div>

                  <section>
                    <strong>New Complaint</strong>
                    <span>
                      Report a campus issue
                    </span>
                  </section>

                  <ArrowUpRight size={17} />

                </Link>

                <Link
                  to="/student/my-complaints"
                  className="color-action action-blue"
                >
                  <div>
                    <FileText size={22} />
                  </div>

                  <section>
                    <strong>My Complaints</strong>
                    <span>
                      View submitted complaints
                    </span>
                  </section>

                  <ArrowUpRight size={17} />

                </Link>

                <Link
                  to="/student/profile"
                  className="color-action action-pink"
                >
                  <div>
                    <User size={22} />
                  </div>

                  <section>
                    <strong>My Profile</strong>
                    <span>
                      Manage your information
                    </span>
                  </section>

                  <ArrowUpRight size={17} />

                </Link>

              </div>

            </div>

          </div>

          {/* BOTTOM INFO */}

          <div className="color-info-banner">

            <div className="info-banner-icon">
              <AlertCircle size={23} />
            </div>

            <div>
              <strong>
                Need to report something?
              </strong>

              <p>
                Whether it's an issue with your hostel,
                classroom, laboratory, internet or transport,
                CampusCare is here to help.
              </p>
            </div>

            <Link to="/student/submit-complaint">
              Report Issue
              <ArrowUpRight size={16} />
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;