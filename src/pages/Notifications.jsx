import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function Notifications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser")
    );

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const storageKey =
      currentUser.role === "admin"
        ? "campuscareAdminNotifications"
        : "campuscareNotifications";

    const savedNotifications = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    if (savedNotifications.length === 0) {
      const defaultNotifications =
        currentUser.role === "admin"
          ? [
              {
                id: Date.now(),
                title: "New Complaint Submitted",
                message:
                  "A new student complaint has been submitted and requires review.",
                time: "Just now",
                read: false,
              },
              {
                id: Date.now() + 1,
                title: "Complaint Resolved",
                message:
                  "A complaint has been marked as resolved by the administration.",
                time: "Today",
                read: false,
              },
            ]
          : [
              {
                id: Date.now(),
                title: "Complaint Submitted",
                message:
                  "Your complaint has been successfully submitted.",
                time: "Just now",
                read: false,
              },
              {
                id: Date.now() + 1,
                title: "Complaint Update",
                message:
                  "Your complaint status has been updated.",
                time: "Today",
                read: false,
              },
            ];

      localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
      setNotifications(defaultNotifications);
    } else {
      setNotifications(savedNotifications);
    }
  }, [navigate]);

  const storageKey =
    user?.role === "admin"
      ? "campuscareAdminNotifications"
      : "campuscareNotifications";

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem(storageKey, JSON.stringify([]));
  };

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div className="notification-page">

      {/* MOBILE MENU BUTTON */}
      <button
        className="notification-mobile-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`notification-sidebar ${
          sidebarOpen ? "notification-sidebar-open" : ""
        }`}
      >
        <div className="notification-brand">
          <div className="notification-brand-icon">
            <Bell size={20} />
          </div>
          <div>
            <h2>CampusCare</h2>
            <span>Grievance Portal</span>
          </div>
        </div>

        <div className="notification-menu-title">
          MAIN MENU
        </div>

        <nav className="notification-menu">

          <Link
            to={
              isAdmin
                ? "/admin/dashboard"
                : "/student/dashboard"
            }
            className="notification-menu-item"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {!isAdmin && (
            <>
              <Link
                to="/student/submit-complaint"
                className="notification-menu-item"
              >
                <FilePlus size={18} />
                Submit Complaint
              </Link>

              <Link
                to="/student/my-complaints"
                className="notification-menu-item"
              >
                <ClipboardList size={18} />
                My Complaints
              </Link>

              <Link
                to="/student/profile"
                className="notification-menu-item"
              >
                <User size={18} />
                Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/all-complaints"
                className="notification-menu-item"
              >
                <ClipboardList size={18} />
                All Complaints
              </Link>

              <Link
                to="/admin/profile"
                className="notification-menu-item"
              >
                <User size={18} />
                Profile
              </Link>
            </>
          )}

          <Link
            to="/notifications"
            className="notification-menu-item active"
          >
            <Bell size={18} />
            Notifications

            {unreadCount > 0 && (
              <span className="notification-sidebar-badge">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <button
          className="notification-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="notification-main">

        {/* TOPBAR */}
        <header className="notification-topbar">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your CampusCare activities</p>
          </div>

          <div className="notification-user">
            <div className="notification-user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>
                {isAdmin ? "Administrator" : "Student"}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="notification-content">

          <div className="notification-header-card">
            <div className="notification-header-left">
              <div className="notification-big-icon">
                <Bell size={25} />
              </div>

              <div>
                <h2>Your Notifications</h2>
                <p>
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }.`
                    : "You're all caught up!"}
                </p>
              </div>
            </div>

            <div className="notification-actions">
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllAsRead}>
                    <CheckCheck size={16} />
                    Mark all as read
                  </button>

                  <button
                    className="clear-btn"
                    onClick={clearAll}
                  >
                    <Trash2 size={16} />
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>

          {/* EMPTY STATE */}
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">
                <Bell size={32} />
              </div>

              <h3>No notifications</h3>

              <p>
                You don't have any notifications right now.
              </p>
            </div>
          ) : (
            <div className="notification-list">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read
                      ? "notification-unread"
                      : ""
                  }`}
                >
                  <div className="notification-item-icon">
                    <Bell size={20} />
                  </div>

                  <div className="notification-item-content">
                    <div className="notification-item-title">
                      <h3>{notification.title}</h3>

                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <span className="notification-time">
                      {notification.time}
                    </span>
                  </div>

                  {!notification.read && (
                    <button
                      className="notification-read-btn"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;