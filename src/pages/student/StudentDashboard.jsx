
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

import api from "../../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Notification popup state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Load student dashboard
  useEffect(() => {
    const loadDashboard = async () => {
      const currentUser = JSON.parse(
        localStorage.getItem("campuscareCurrentUser") || "null"
      );

      const token = localStorage.getItem("campuscareToken");

      if (!currentUser || currentUser.role !== "student" || !token) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const response = await api.get("/complaints/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(response.data.complaints || []);
        setError("");
      } catch (err) {
        console.error("Dashboard complaints error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("campuscareCurrentUser");
          localStorage.removeItem("campuscareToken");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message || "Unable to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // Fetch notifications for the currently logged-in student
  const fetchNotifications = async () => {
    const token = localStorage.getItem("campuscareToken");

    if (!token) return;

    setNotificationsLoading(true);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        api.get("/notifications", { headers }),
        api.get("/notifications/unread-count", { headers }),
      ]);

      setNotifications(
        notificationsResponse.data.notifications || []
      );

      setUnreadCount(countResponse.data.count || 0);
    } catch (err) {
      console.error("Unable to load notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Load unread count when the dashboard opens and refresh periodically
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const toggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState) {
      fetchNotifications();
    }
  };

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    localStorage.removeItem("campuscareToken");
    navigate("/login");
  };

  // MongoDB status values: PENDING, IN-PROGRESS, RESOLVED
  const pending = complaints.filter(
    (complaint) => complaint.status === "PENDING"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "IN-PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  const getStatusText = (status) => {
    if (status === "IN-PROGRESS") return "In Progress";
    if (status === "RESOLVED") return "Resolved";
    return "Pending";
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") return "color-status resolved";
    if (status === "IN-PROGRESS") return "color-status progress";
    return "color-status pending";
  };

  const getStatusIcon = (status) => {
    if (status === "RESOLVED") return <CheckCircle2 size={15} />;
    if (status === "IN-PROGRESS") return <RefreshCw size={15} />;
    return <Clock3 size={15} />;
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNotificationDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredComplaints = complaints.filter((complaint) =>
    `${complaint.title || ""} ${
      complaint.category || ""
    } ${getStatusText(complaint.status)} ${
      complaint.description || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const recentComplaints = filteredComplaints.slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (!user) {
    return <div className="page-loading">Loading Student Dashboard...</div>;
  }

  return (
    <div className="color-dashboard">
      {/* SIDEBAR */}
      <aside className="color-sidebar">
        <div className="color-brand">
          <div className="color-brand-icon">C</div>
          <div>
            <h2>CampusCare</h2>
            <span>Grievance Portal</span>
          </div>
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

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

          <Link
            to="/notifications"
            className="color-nav-link"
          >
            <Bell size={19} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="student-sidebar-unread">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="sidebar-help-card">
          <div className="help-icon">
            <Sparkles size={20} />
          </div>

          <strong>Need Help?</strong>

          <p>
            Submit your concern and track it until it gets resolved.
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

          <button className="color-logout" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* NOTIFICATION BELL AND POPUP */}
            <div
              className="student-notification-wrapper"
              style={{ position: "relative" }}
            >
              <button
                type="button"
                className="notification-btn"
                aria-label="Notifications"
                aria-expanded={showNotifications}
                onClick={toggleNotifications}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="student-notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <button
                    type="button"
                    aria-label="Close notification popup"
                    onClick={() => setShowNotifications(false)}
                    className="student-notification-backdrop"
                  />

                  <div className="student-notification-popup">
                    <div className="student-notification-header">
                      <div>
                        <h3>Notifications</h3>
                        <p>
                          {unreadCount} unread notification
                          {unreadCount === 1 ? "" : "s"}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="student-notification-close"
                        aria-label="Close"
                        onClick={() => setShowNotifications(false)}
                      >
                        ×
                      </button>
                    </div>

                    <div className="student-notification-list">
                      {notificationsLoading ? (
                        <div className="student-notification-empty">
                          <RefreshCw size={24} />
                          <p>Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="student-notification-empty">
                          <Bell size={28} />
                          <p>No notifications yet.</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((item) => (
                          <div
                            key={item._id}
                            className={`student-notification-item ${
                              item.read ? "" : "unread"
                            }`}
                          >
                            <div className="student-notification-icon">
                              {item.type === "RESOLUTION" ? (
                                <CheckCircle2 size={18} />
                              ) : item.type === "STATUS_UPDATE" ? (
                                <RefreshCw size={18} />
                              ) : (
                                <FileText size={18} />
                              )}
                            </div>

                            <div className="student-notification-text">
                              <strong>{item.title}</strong>
                              <p>{item.message}</p>
                              <span>
                                {formatNotificationDate(item.createdAt)}
                              </span>
                            </div>

                            {!item.read && (
                              <span
                                className="student-notification-unread-dot"
                                title="Unread"
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <Link
                      to="/notifications"
                      className="student-notification-view-all"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </>
              )}
            </div>

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

        {/* DASHBOARD CONTENT */}
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
                Keep track of your campus concerns, submit new complaints,
                and stay updated on every resolution.
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

          {/* ERROR MESSAGE */}
          {error && (
            <div
              className="complaint-form-error"
              style={{ marginTop: "20px" }}
            >
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          {/* STAT CARDS */}
          <div className="color-stat-grid">
            <div className="color-stat-card blue-card">
              <div className="stat-card-icon">
                <FileText size={23} />
              </div>

              <div className="stat-card-info">
                <span>Total Complaints</span>
                <strong>{loading ? "..." : complaints.length}</strong>
                <small>All submitted complaints</small>
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
                <strong>{loading ? "..." : pending}</strong>
                <small>Waiting for review</small>
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
                <strong>{loading ? "..." : inProgress}</strong>
                <small>Currently being handled</small>
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
                <strong>{loading ? "..." : resolved}</strong>
                <small>Successfully completed</small>
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

              {loading ? (
                <div className="color-empty">
                  <div>
                    <RefreshCw size={25} />
                  </div>
                  <h3>Loading complaints...</h3>
                  <p>Fetching your latest complaints from the server.</p>
                </div>
              ) : recentComplaints.length === 0 ? (
                <div className="color-empty">
                  <div>
                    <MessageSquare size={25} />
                  </div>
                  <h3>No complaints yet</h3>
                  <p>Your submitted complaints will appear here.</p>

                  <Link to="/student/submit-complaint">
                    Submit your first complaint
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="color-complaint-list">
                  {recentComplaints.map((complaint) => (
                    <Link
                      key={complaint._id}
                      to={`/student/complaint-details/${complaint._id}`}
                      className="color-complaint-item"
                    >
                      <div className="complaint-color-icon">
                        <MessageSquare size={19} />
                      </div>

                      <div className="complaint-main">
                        <div className="complaint-title-row">
                          <h3>
                            {complaint.title || "Campus Complaint"}
                          </h3>

                          <div className={getStatusClass(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            {getStatusText(complaint.status)}
                          </div>
                        </div>

                        <div className="complaint-meta">
                          <span>
                            <FileText size={13} />
                            {complaint.category || "General"}
                          </span>

                          {complaint.location && (
                            <span>
                              <MapPin size={13} />
                              {complaint.location}
                            </span>
                          )}

                          <span>
                            <Clock3 size={13} />
                            {formatDate(complaint.createdAt)}
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
                    <span>Report a campus issue</span>
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
                    <span>View submitted complaints</span>
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
                    <span>Manage your information</span>
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
              <strong>Need to report something?</strong>
              <p>
                Whether it's an issue with your hostel, classroom,
                laboratory, internet or transport, CampusCare is here to help.
              </p>
            </div>

            <Link to="/student/submit-complaint">
              Report Issue
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* Notification popup styles */}
      <style>{`
        .student-notification-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .student-notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 20px;
          background: #ef4444;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }

        .student-sidebar-unread {
          margin-left: auto;
          min-width: 20px;
          padding: 2px 6px;
          border-radius: 20px;
          background: #ef4444;
          color: #ffffff;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
        }

        .student-notification-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: transparent;
          border: none;
          cursor: default;
        }

        .student-notification-popup {
          position: absolute;
          top: 48px;
          right: -85px;
          width: min(420px, calc(100vw - 32px));
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
          z-index: 100;
          overflow: hidden;
        }

        .student-notification-header {
          padding: 18px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .student-notification-header h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
        }

        .student-notification-header p {
          margin: 5px 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .student-notification-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 9px;
          background: #f1f5f9;
          color: #334155;
          font-size: 23px;
          line-height: 1;
          cursor: pointer;
        }

        .student-notification-list {
          max-height: 340px;
          overflow-y: auto;
        }

        .student-notification-empty {
          min-height: 145px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          color: #64748b;
          text-align: center;
        }

        .student-notification-empty p {
          margin: 0;
          font-size: 13px;
        }

        .student-notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px 18px;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }

        .student-notification-item.unread {
          background: #f5f7ff;
        }

        .student-notification-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 11px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-notification-text {
          flex: 1;
          min-width: 0;
        }

        .student-notification-text strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .student-notification-text p {
          margin: 5px 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .student-notification-text span {
          color: #94a3b8;
          font-size: 11px;
        }

        .student-notification-unread-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          margin-top: 6px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .student-notification-view-all {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .student-notification-view-all:hover {
          background: #f8fafc;
        }

        @media (max-width: 600px) {
          .student-notification-popup {
            position: fixed;
            top: 75px;
            right: 12px;
            width: calc(100vw - 24px);
          }
        }
      `}</style>
    </div>
  );
}

export default StudentDashboard;
