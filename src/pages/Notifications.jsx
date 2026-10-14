
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import api from "../services/api";

const REFRESH_INTERVAL = 10000;

function Notifications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const token = localStorage.getItem("campuscareToken");

  // =========================================
  // LOAD CURRENT USER
  // =========================================
  useEffect(() => {
    const savedUser = localStorage.getItem(
      "campuscareCurrentUser"
    );
    const savedToken = localStorage.getItem(
      "campuscareToken"
    );

    if (!savedUser || !savedToken) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("campuscareCurrentUser");
      localStorage.removeItem("campuscareToken");
      navigate("/login");
    }
  }, [navigate]);

  // =========================================
  // FETCH NOTIFICATIONS FROM BACKEND
  // =========================================
  const fetchNotifications = useCallback(
    async (showLoader = false) => {
      const currentToken = localStorage.getItem(
        "campuscareToken"
      );

      if (!currentToken) {
        navigate("/login");
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await api.get("/notifications", {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        setNotifications(
          response.data.notifications || []
        );
      } catch (err) {
        console.error(
          "Fetch notifications error:",
          err
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem(
            "campuscareCurrentUser"
          );
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load notifications. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  // =========================================
  // AUTOMATIC REFRESH EVERY 10 SECONDS
  // =========================================
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    // Load notifications immediately.
    fetchNotifications(true);

    // Then automatically check for new notifications.
    const intervalId = window.setInterval(() => {
      fetchNotifications(false);
    }, REFRESH_INTERVAL);

    // Clean up when leaving the page.
    return () => {
      window.clearInterval(intervalId);
    };
  }, [user, token, fetchNotifications]);

  // =========================================
  // MARK ONE NOTIFICATION AS READ
  // =========================================
  const markAsRead = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      const currentToken = localStorage.getItem(
        "campuscareToken"
      );

      await api.put(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Mark notification as read error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Could not mark the notification as read."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================
  const markAllAsRead = async () => {
    try {
      setActionLoading("all");
      setError("");

      const currentToken = localStorage.getItem(
        "campuscareToken"
      );

      await api.put(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Mark all as read error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Could not mark all notifications as read."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================
  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    localStorage.removeItem("campuscareToken");
    navigate("/login");
  };

  // =========================================
  // HELPERS
  // =========================================
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const isAdmin = user?.role === "admin";

  const formatTime = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getNotificationIcon = (notification) => {
    if (notification.type === "RESOLUTION") {
      return <CheckCircle2 size={21} />;
    }

    if (notification.type === "STATUS_UPDATE") {
      return <Bell size={21} />;
    }

    return <AlertCircle size={21} />;
  };

  // =========================================
  // LOADING USER
  // =========================================
  if (!user) {
    return (
      <div className="notification-loading-screen">
        <RefreshCw className="notification-spin" size={28} />
        <p>Loading CampusCare...</p>
      </div>
    );
  }

  // =========================================
  // MAIN PAGE
  // =========================================
  return (
    <div className="notification-page">
      <style>{`
        .notification-page {
          min-height: 100vh;
          display: flex;
          background: #f4f7fb;
          color: #172033;
          font-family: Inter, Arial, sans-serif;
        }

        .notification-sidebar {
          width: 250px;
          flex-shrink: 0;
          min-height: 100vh;
          padding: 26px 16px;
          background: #172554;
          color: #fff;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .notification-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 10px 30px;
          font-size: 21px;
          font-weight: 800;
        }

        .notification-brand-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #4f46e5;
        }

        .notification-nav-label {
          margin: 10px 10px 12px;
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .notification-nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .notification-nav a,
        .notification-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 0;
          border-radius: 10px;
          color: #dbeafe;
          background: transparent;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
          transition: background .2s ease;
        }

        .notification-nav a:hover,
        .notification-nav a.active,
        .notification-logout:hover {
          color: #fff;
          background: #312e81;
        }

        .notification-nav a.active {
          font-weight: 700;
        }

        .notification-sidebar-bottom {
          margin-top: auto;
          padding-top: 25px;
        }

        .notification-user-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 8px;
          margin-bottom: 8px;
          border-top: 1px solid #334155;
        }

        .notification-avatar {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #6366f1;
          color: #fff;
          font-weight: 800;
        }

        .notification-user-info {
          min-width: 0;
        }

        .notification-user-info strong,
        .notification-user-info span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-user-info strong {
          font-size: 13px;
        }

        .notification-user-info span {
          margin-top: 4px;
          color: #c7d2fe;
          font-size: 11px;
        }

        .notification-main {
          min-width: 0;
          flex: 1;
        }

        .notification-topbar {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 32px;
          background: #fff;
          border-bottom: 1px solid #e5eaf2;
          box-sizing: border-box;
        }

        .notification-topbar-left,
        .notification-topbar-right {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .notification-topbar h2 {
          margin: 0;
          font-size: 19px;
        }

        .notification-topbar small {
          display: block;
          margin-top: 4px;
          color: #64748b;
        }

        .notification-mobile-menu {
          display: none;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #172033;
        }

        .notification-content {
          max-width: 1000px;
          padding: 32px;
          margin: 0 auto;
        }

        .notification-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 25px;
        }

        .notification-heading h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -.7px;
        }

        .notification-heading p {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .notification-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .notification-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid #dbe3ef;
          border-radius: 10px;
          background: #fff;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .notification-button:hover:not(:disabled) {
          border-color: #818cf8;
          color: #4338ca;
          background: #eef2ff;
        }

        .notification-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .notification-button-primary {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #fff;
        }

        .notification-button-primary:hover:not(:disabled) {
          color: #fff;
          background: #4338ca;
        }

        .notification-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }

        .notification-summary-card {
          padding: 20px;
          background: #fff;
          border: 1px solid #e5eaf2;
          border-radius: 15px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, .025);
        }

        .notification-summary-card span {
          color: #64748b;
          font-size: 13px;
        }

        .notification-summary-card strong {
          display: block;
          margin-top: 9px;
          font-size: 27px;
        }

        .notification-summary-card .summary-icon {
          float: right;
          color: #4f46e5;
        }

        .notification-panel {
          overflow: hidden;
          background: #fff;
          border: 1px solid #e5eaf2;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, .035);
        }

        .notification-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 22px;
          border-bottom: 1px solid #edf0f5;
        }

        .notification-panel-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .notification-unread-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 20px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 800;
        }

        .notification-auto-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 12px;
        }

        .notification-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 21px 22px;
          border-bottom: 1px solid #edf0f5;
          transition: background .2s ease;
        }

        .notification-item:last-child {
          border-bottom: 0;
        }

        .notification-item.unread {
          background: #f8faff;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #4f46e5;
          background: #eef2ff;
        }

        .notification-item-body {
          min-width: 0;
          flex: 1;
        }

        .notification-item-title {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin: 1px 0 7px;
          font-size: 14px;
        }

        .notification-item-title strong {
          color: #1e293b;
        }

        .notification-new {
          padding: 3px 7px;
          border-radius: 6px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .notification-message {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .notification-time {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 11px;
          color: #94a3b8;
          font-size: 11px;
        }

        .notification-item-actions {
          flex-shrink: 0;
        }

        .notification-read-button {
          padding: 7px 10px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: #fff;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .notification-read-button:hover {
          color: #4338ca;
          border-color: #a5b4fc;
        }

        .notification-read-button:disabled {
          opacity: .6;
          cursor: wait;
        }

        .notification-empty,
        .notification-loading {
          padding: 55px 20px;
          text-align: center;
          color: #64748b;
        }

        .notification-empty-icon {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          margin: 0 auto 17px;
          border-radius: 20px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .notification-empty h3 {
          margin: 0 0 9px;
          color: #1e293b;
          font-size: 17px;
        }

        .notification-empty p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
        }

        .notification-error {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding: 13px 15px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
        }

        .notification-error span {
          flex: 1;
        }

        .notification-spin {
          animation: notification-rotation 1s linear infinite;
        }

        @keyframes notification-rotation {
          to { transform: rotate(360deg); }
        }

        .notification-loading-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #4f46e5;
          font-family: Inter, Arial, sans-serif;
        }

        .notification-loading-screen p {
          color: #64748b;
        }

        @media (max-width: 900px) {
          .notification-sidebar {
            position: fixed;
            z-index: 1000;
            top: 0;
            bottom: 0;
            left: 0;
            width: 250px;
            min-height: 100vh;
            transform: translateX(-100%);
            transition: transform .25s ease;
            box-shadow: 8px 0 25px rgba(15, 23, 42, .15);
          }

          .notification-sidebar.open {
            transform: translateX(0);
          }

          .notification-mobile-menu {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .notification-content {
            padding: 24px 18px;
          }

          .notification-topbar {
            padding: 14px 18px;
          }
        }

        @media (max-width: 600px) {
          .notification-heading h1 {
            font-size: 24px;
          }

          .notification-summary {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .notification-summary-card {
            padding: 15px;
          }

          .notification-summary-card strong {
            font-size: 23px;
          }

          .notification-item {
            gap: 11px;
            padding: 17px 13px;
          }

          .notification-item-icon {
            width: 37px;
            height: 37px;
          }

          .notification-panel-header {
            padding: 16px 13px;
          }

          .notification-topbar h2 {
            font-size: 16px;
          }

          .notification-topbar small {
            font-size: 11px;
          }

          .notification-item-actions {
            display: none;
          }

          .notification-actions {
            width: 100%;
          }

          .notification-actions .notification-button {
            flex: 1;
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside
        className={`notification-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="notification-brand">
          <div className="notification-brand-icon">
            <ShieldCheck size={24} />
          </div>
          <span>CampusCare</span>

          <button
            type="button"
            className="notification-mobile-menu"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: "auto", color: "#fff" }}
          >
            <X size={21} />
          </button>
        </div>

        <div className="notification-nav-label">
          {isAdmin ? "Administration" : "Student Menu"}
        </div>

        <nav className="notification-nav">
          {isAdmin ? (
            <>
              <Link
                to="/admin-dashboard"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard size={19} />
                Dashboard
              </Link>

              <Link
                to="/admin/complaints"
                onClick={() => setSidebarOpen(false)}
              >
                <ClipboardList size={19} />
                All Complaints
              </Link>

              <Link
                to="/admin/profile"
                onClick={() => setSidebarOpen(false)}
              >
                <User size={19} />
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/student-dashboard"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard size={19} />
                Dashboard
              </Link>

              <Link
                to="/submit-complaint"
                onClick={() => setSidebarOpen(false)}
              >
                <FilePlus size={19} />
                Submit Complaint
              </Link>

              <Link
                to="/my-complaints"
                onClick={() => setSidebarOpen(false)}
              >
                <ClipboardList size={19} />
                My Complaints
              </Link>

              <Link
                to="/notifications"
                className="active"
                onClick={() => setSidebarOpen(false)}
              >
                <Bell size={19} />
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 11,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                onClick={() => setSidebarOpen(false)}
              >
                <User size={19} />
                My Profile
              </Link>
            </>
          )}
        </nav>

        <div className="notification-sidebar-bottom">
          <div className="notification-user-mini">
            <div className="notification-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="notification-user-info">
              <strong>{user.name}</strong>
              <span>
                {isAdmin ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="notification-logout"
            onClick={logout}
            style={{ width: "100%" }}
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="notification-main">
        <header className="notification-topbar">
          <div className="notification-topbar-left">
            <button
              type="button"
              className="notification-mobile-menu"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={23} />
            </button>

            <div>
              <h2>Notifications</h2>
              <small>Stay updated with CampusCare</small>
            </div>
          </div>

          <div className="notification-topbar-right">
            <Bell size={21} color="#4f46e5" />
            <span style={{ fontSize: 13, color: "#64748b" }}>
              {user.name}
            </span>
          </div>
        </header>

        <section className="notification-content">
          <div className="notification-heading">
            <div>
              <h1>Your Notifications</h1>
              <p>
                Stay informed about complaint status changes
                and responses from the administration.
              </p>
            </div>

            <div className="notification-actions">
              <button
                type="button"
                className="notification-button"
                onClick={() => fetchNotifications(false)}
                disabled={refreshing}
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing ? "notification-spin" : ""
                  }
                />
                Refresh
              </button>

              <button
                type="button"
                className="notification-button notification-button-primary"
                onClick={markAllAsRead}
                disabled={
                  unreadCount === 0 || actionLoading !== ""
                }
              >
                <CheckCheck size={16} />
                {actionLoading === "all"
                  ? "Updating..."
                  : "Mark all read"}
              </button>
            </div>
          </div>

          {error && (
            <div className="notification-error" role="alert">
              <AlertCircle size={19} />
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* SUMMARY CARDS */}
          <div className="notification-summary">
            <div className="notification-summary-card">
              <Bell
                className="summary-icon"
                size={21}
              />
              <span>Total Notifications</span>
              <strong>{notifications.length}</strong>
            </div>

            <div className="notification-summary-card">
              <AlertCircle
                className="summary-icon"
                size={21}
              />
              <span>Unread Notifications</span>
              <strong>{unreadCount}</strong>
            </div>

            <div className="notification-summary-card">
              <CheckCircle2
                className="summary-icon"
                size={21}
              />
              <span>Read Notifications</span>
              <strong>
                {notifications.length - unreadCount}
              </strong>
            </div>
          </div>

          {/* NOTIFICATION LIST */}
          <section className="notification-panel">
            <div className="notification-panel-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <h3>Recent Activity</h3>

                {unreadCount > 0 && (
                  <span className="notification-unread-badge">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="notification-auto-status">
                <span className="notification-live-dot" />
                Auto-refresh: 10 sec
              </div>
            </div>

            {loading ? (
              <div className="notification-loading">
                <RefreshCw
                  className="notification-spin"
                  size={27}
                />
                <p>Loading your notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">
                  <Bell size={30} />
                </div>

                <h3>No notifications yet</h3>

                <p>
                  When the administrator updates your complaint
                  status or resolution, notifications will appear
                  here automatically.
                </p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <article
                    key={notification._id}
                    className={`notification-item ${
                      notification.read ? "" : "unread"
                    }`}
                  >
                    <div className="notification-item-icon">
                      {getNotificationIcon(notification)}
                    </div>

                    <div className="notification-item-body">
                      <div className="notification-item-title">
                        <strong>
                          {notification.title}
                        </strong>

                        {!notification.read && (
                          <span className="notification-new">
                            New
                          </span>
                        )}
                      </div>

                      <p className="notification-message">
                        {notification.message}
                      </p>

                      {notification.complaint?.title && (
                        <p
                          className="notification-message"
                          style={{ marginTop: 7 }}
                        >
                          Complaint:{" "}
                          <strong>
                            {notification.complaint.title}
                          </strong>
                        </p>
                      )}

                      <div className="notification-time">
                        <Clock size={13} />
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>

                    {!notification.read && (
                      <div className="notification-item-actions">
                        <button
                          type="button"
                          className="notification-read-button"
                          disabled={
                            actionLoading === notification._id
                          }
                          onClick={() =>
                            markAsRead(notification._id)
                          }
                        >
                          {actionLoading === notification._id
                            ? "Saving..."
                            : "Mark read"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <p
            style={{
              margin: "18px 2px",
              color: "#94a3b8",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            CampusCare keeps you informed about your campus
            complaints.
          </p>
        </section>
      </main>

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            border: 0,
            background: "rgba(15, 23, 42, .4)",
            cursor: "pointer",
          }}
          className="notification-mobile-backdrop"
        />
      )}
    </div>
  );
}

export default Notifications;
