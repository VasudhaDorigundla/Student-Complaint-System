
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  Users,
  LogOut,
  Bell,
  Clock3,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  CheckCheck,
  X,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalStudents: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("campuscareToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH ADMIN NOTIFICATIONS
  // ==========================================
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const [notificationResponse, countResponse] = await Promise.all([
        api.get("/notifications", authConfig),
        api.get("/notifications/unread-count", authConfig),
      ]);

      setNotifications(
        notificationResponse.data.notifications || []
      );

      setUnreadCount(countResponse.data.count || 0);
    } catch (err) {
      console.error("Admin notifications error:", err);
    }
  }, [token]);

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "admin" || !token) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [complaintResponse, statsResponse] = await Promise.all([
          api.get("/complaints/admin/all", authConfig),
          api.get("/dashboard/admin", authConfig),
        ]);

        if (!active) return;

        setComplaints(complaintResponse.data.complaints || []);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        }
      } catch (err) {
        console.error("Admin dashboard error:", err);

        if (!active) return;

        if (err.response?.status === 401) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem("campuscareCurrentUser");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();
    fetchNotifications();

    // Refresh notifications periodically.
    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [navigate, token, fetchNotifications]);

  // ==========================================
  // MARK ONE NOTIFICATION AS READ
  // ==========================================
  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read`,
        {},
        authConfig
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notificationId
            ? { ...item, read: true }
            : item
        )
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (err) {
      console.error("Unable to mark notification as read:", err);
    }
  };

  // ==========================================
  // MARK ALL NOTIFICATIONS AS READ
  // ==========================================
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all", {}, authConfig);

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, read: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Unable to mark all as read:", err);
    }
  };

  // ==========================================
  // OPEN COMPLAINT FROM NOTIFICATION
  // ==========================================
  const openNotification = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    setNotificationOpen(false);

    if (notification.complaint?._id) {
      navigate(
        `/admin/complaint-details/${notification.complaint._id}`
      );
    } else {
      navigate("/notifications");
    }
  };

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    localStorage.removeItem("campuscareToken");
    navigate("/login");
  };

  const retryDashboard = () => {
    window.location.reload();
  };

  // ==========================================
  // CHART DATA
  // ==========================================
  const pending = complaints.filter(
    (item) => item.status === "PENDING"
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === "IN-PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "RESOLVED"
  ).length;

  const statusData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ].filter((item) => item.value > 0);

  const categoryMap = {};

  complaints.forEach((item) => {
    const category = item.category || "Other";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      complaints: value,
    })
  );

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNotificationDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    if (status === "IN-PROGRESS") return "In Progress";
    if (status === "RESOLVED") return "Resolved";
    return "Pending";
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") return "resolved";
    if (status === "IN-PROGRESS") return "progress";
    return "pending";
  };

  const getNotificationIcon = (type) => {
    if (type === "URGENT_COMPLAINT") {
      return <AlertCircle size={19} color="#dc2626" />;
    }

    if (type === "NEW_STUDENT") {
      return <Users size={19} color="#7c3aed" />;
    }

    if (type === "RESOLUTION") {
      return <CheckCircle size={19} color="#16a34a" />;
    }

    if (type === "STUDENT_FOLLOWUP") {
      return <User size={19} color="#0891b2" />;
    }

    return <FileText size={19} color="#4f46e5" />;
  };

  if (!user || loading) {
    return (
      <div className="page-loading">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-loading">
        <div>
          <AlertCircle size={35} />
          <p>{error}</p>
          <button
            onClick={retryDashboard}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <img src="/college-logo.png" alt="MITS College Logo" />
          </div>
          <div>
            <strong>CampusCare</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <div className="admin-sidebar-title">MAIN MENU</div>

        <nav className="admin-sidebar-nav">
          <Link to="/admin/dashboard" className="active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/all-complaints">
            <FileText size={19} />
            <span>All Complaints</span>
          </Link>

          <Link to="/admin/profile">
            <User size={19} />
            <span>Profile</span>
          </Link>

          <Link to="/notifications">
            <Bell size={19} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span style={styles.sidebarBadge}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <button onClick={logout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-page-title">
            <span className="admin-page-label">ADMIN PORTAL</span>
            <h2>Dashboard</h2>
            <p>Monitor and manage student complaints</p>
          </div>

          <div className="admin-topbar-right">
            {/* NOTIFICATION BELL */}
            <div style={styles.notificationWrapper}>
              <button
                type="button"
                className="admin-notification-btn"
                aria-label="Open notifications"
                aria-expanded={notificationOpen}
                onClick={() => {
                  setNotificationOpen((previous) => !previous);
                  if (!notificationOpen) {
                    setNotificationLoading(true);
                    fetchNotifications().finally(() =>
                      setNotificationLoading(false)
                    );
                  }
                }}
                style={styles.bellButton}
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span style={styles.bellBadge}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div style={styles.notificationPanel}>
                  <div style={styles.notificationHeader}>
                    <div>
                      <strong>Notifications</strong>
                      <p style={styles.notificationSubtitle}>
                        {unreadCount} unread notification
                        {unreadCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Close notifications"
                      onClick={() => setNotificationOpen(false)}
                      style={styles.closeButton}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      style={styles.markAllButton}
                    >
                      <CheckCheck size={15} />
                      Mark all as read
                    </button>
                  )}

                  <div style={styles.notificationList}>
                    {notificationLoading ? (
                      <div style={styles.emptyNotifications}>
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={styles.emptyNotifications}>
                        <Bell size={30} />
                        <strong>No notifications yet</strong>
                        <span>
                          New admin alerts will appear here.
                        </span>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((item) => (
                        <button
                          type="button"
                          key={item._id}
                          onClick={() => openNotification(item)}
                          style={{
                            ...styles.notificationItem,
                            background: item.read ? "#ffffff" : "#f0f5ff",
                          }}
                        >
                          <div style={styles.notificationIcon}>
                            {getNotificationIcon(item.type)}
                          </div>

                          <div style={styles.notificationText}>
                            <div style={styles.notificationTitleRow}>
                              <strong>{item.title}</strong>
                              {!item.read && (
                                <span style={styles.unreadDot} />
                              )}
                            </div>

                            <p>{item.message}</p>

                            <small>
                              {formatNotificationDate(item.createdAt)}
                            </small>
                          </div>

                          <ExternalLink
                            size={15}
                            style={{ flexShrink: 0, color: "#64748b" }}
                          />
                        </button>
                      ))
                    )}
                  </div>

                  <Link
                    to="/notifications"
                    onClick={() => setNotificationOpen(false)}
                    style={styles.viewAllNotifications}
                  >
                    View all notifications
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>

            <div className="admin-user">
              <div className="admin-user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{user.name}</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <section className="admin-dashboard-content">
          {/* WELCOME */}
          <div className="admin-welcome-card">
            <div className="admin-welcome-content">
              <span className="admin-welcome-label">ADMIN OVERVIEW</span>
              <h1>Welcome back, {user.name}!</h1>
              <p>
                Monitor complaints, manage student concerns,
                and keep your campus services running smoothly.
              </p>
              <Link
                to="/admin/all-complaints"
                className="admin-welcome-button"
              >
                <FileText size={17} />
                Manage Complaints
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="admin-welcome-visual">
              <div className="admin-floating-icon icon-one">
                <FileText size={22} />
              </div>
              <div className="admin-floating-icon icon-two">
                <CheckCircle size={22} />
              </div>
              <div className="admin-dashboard-symbol">
                <LayoutDashboard size={58} />
              </div>
              <div className="admin-floating-icon icon-three">
                <Bell size={20} />
              </div>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="admin-stat-grid">
            <div className="admin-stat-card stat-total">
              <div className="admin-stat-icon total">
                <FileText size={23} />
              </div>
              <div className="admin-stat-content">
                <span>Total Complaints</span>
                <strong>{stats.totalComplaints}</strong>
                <small>All submitted complaints</small>
              </div>
            </div>

            <div className="admin-stat-card stat-pending">
              <div className="admin-stat-icon pending">
                <Clock3 size={23} />
              </div>
              <div className="admin-stat-content">
                <span>Pending</span>
                <strong>{stats.pendingComplaints}</strong>
                <small>Waiting for review</small>
              </div>
            </div>

            <div className="admin-stat-card stat-progress">
              <div className="admin-stat-icon progress">
                <LoaderCircle size={23} />
              </div>
              <div className="admin-stat-content">
                <span>In Progress</span>
                <strong>{stats.inProgressComplaints}</strong>
                <small>Currently being handled</small>
              </div>
            </div>

            <div className="admin-stat-card stat-resolved">
              <div className="admin-stat-icon resolved">
                <CheckCircle size={23} />
              </div>
              <div className="admin-stat-content">
                <span>Resolved</span>
                <strong>{stats.resolvedComplaints}</strong>
                <small>Successfully completed</small>
              </div>
            </div>

            <div className="admin-stat-card stat-total">
              <div className="admin-stat-icon total">
                <Users size={23} />
              </div>
              <div className="admin-stat-content">
                <span>Total Students</span>
                <strong>{stats.totalStudents}</strong>
                <small>Registered student accounts</small>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="admin-charts-grid">
            <div className="admin-chart-card">
              <div className="admin-card-heading">
                <div>
                  <span className="admin-section-label">ANALYTICS</span>
                  <h3>Complaint Status</h3>
                  <p>Current complaint distribution</p>
                </div>
              </div>

              <div className="admin-pie-container">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        innerRadius={55}
                        paddingAngle={3}
                      >
                        {statusData.map((entry, index) => {
                          const colors = [
                            "#f59e0b",
                            "#7c3aed",
                            "#16a34a",
                          ];

                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index]}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="admin-empty-chart">
                    <AlertCircle size={30} />
                    <p>No complaints yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-chart-card">
              <div className="admin-card-heading">
                <div>
                  <span className="admin-section-label">ANALYTICS</span>
                  <h3>Complaints by Category</h3>
                  <p>Complaint volume by category</p>
                </div>
              </div>

              <div className="admin-bar-container">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categoryData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="complaints"
                        fill="#6d4aff"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="admin-empty-chart">
                    <AlertCircle size={30} />
                    <p>No category data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RECENT COMPLAINTS */}
          <div className="admin-recent-card">
            <div className="admin-recent-header">
              <div>
                <span className="admin-section-label">ACTIVITY</span>
                <h3>Recent Complaints</h3>
                <p>Latest complaints submitted by students</p>
              </div>

              <Link to="/admin/all-complaints">
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="admin-empty-state">
                <FileText size={35} />
                <h4>No complaints yet</h4>
                <p>Student complaints will appear here.</p>
              </div>
            ) : (
              <div className="admin-recent-list">
                {recentComplaints.map((complaint) => (
                  <div
                    className="admin-recent-row"
                    key={complaint._id}
                  >
                    <div className="admin-complaint-main">
                      <div className="admin-complaint-icon">
                        <FileText size={18} />
                      </div>
                      <div>
                        <strong>
                          {complaint.title || "Untitled Complaint"}
                        </strong>
                        <span>
                          {complaint.category || "Other"}
                          {" • "}
                          {formatDate(complaint.createdAt)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`admin-status-badge ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </span>

                    <Link
                      to={`/admin/complaint-details/${complaint._id}`}
                      className="admin-view-btn"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  notificationWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  bellButton: {
    position: "relative",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
  bellBadge: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    minWidth: "19px",
    height: "19px",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "#ef4444",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 700,
    border: "2px solid #ffffff",
  },
  sidebarBadge: {
    marginLeft: "auto",
    background: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "2px 7px",
    fontSize: "11px",
    fontWeight: 700,
  },
  notificationPanel: {
    position: "absolute",
    top: "calc(100% + 14px)",
    right: 0,
    width: "min(390px, calc(100vw - 30px))",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    boxShadow: "0 18px 55px rgba(15, 23, 42, 0.18)",
    zIndex: 1000,
    overflow: "hidden",
    color: "#0f172a",
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "17px 18px 12px",
    borderBottom: "1px solid #eef2f7",
  },
  notificationSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#64748b",
  },
  closeButton: {
    display: "grid",
    placeItems: "center",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "8px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    color: "#475569",
  },
  markAllButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    margin: "10px 15px",
    padding: "7px 10px",
    background: "#eef2ff",
    color: "#4338ca",
    border: "none",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  notificationList: {
    maxHeight: "360px",
    overflowY: "auto",
  },
  notificationItem: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    padding: "14px 15px",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "left",
    cursor: "pointer",
    color: "#0f172a",
  },
  notificationIcon: {
    flexShrink: 0,
    width: "37px",
    height: "37px",
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    background: "#f1f5f9",
  },
  notificationText: {
    minWidth: 0,
    flex: 1,
  },
  notificationTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
  },
  unreadDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#4f46e5",
    flexShrink: 0,
  },
  notificationTextMessage: {
    color: "#64748b",
  },
  emptyNotifications: {
    padding: "30px 15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "13px",
    textAlign: "center",
  },
  viewAllNotifications: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    padding: "14px",
    borderTop: "1px solid #e2e8f0",
    textDecoration: "none",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: 600,
  },
};

export default AdminDashboard;
