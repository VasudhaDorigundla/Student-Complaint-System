import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Bell,
  Clock3,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
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

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const savedComplaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    setComplaints(savedComplaints);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  if (!user) {
    return <div className="page-loading">Loading...</div>;
  }

  const total = complaints.length;

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const rejected = complaints.filter(
    (item) => item.status === "Rejected"
  ).length;

  const statusData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
    { name: "Rejected", value: rejected },
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

  const recentComplaints = [...complaints].reverse().slice(0, 5);

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-logo">
            <img
              src="/college-logo.png"
              alt="MITS College Logo"
            />
          </div>

          <div>
            <strong>CampusCare</strong>
            <span>Admin Portal</span>
          </div>

        </div>

        <div className="admin-sidebar-title">
          MAIN MENU
        </div>

        <nav className="admin-sidebar-nav">

          <Link
            to="/admin/dashboard"
            className="active"
          >
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
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <button onClick={logout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div className="admin-page-title">

            <span className="admin-page-label">
              ADMIN PORTAL
            </span>

            <h2>Dashboard</h2>

            <p>
              Monitor and manage student complaints
            </p>

          </div>

          <div className="admin-topbar-right">

            <Link
              to="/notifications"
              className="admin-notification-btn"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </Link>

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


        {/* CONTENT */}

        <section className="admin-dashboard-content">

          {/* ================= WELCOME ================= */}

          <div className="admin-welcome-card">

            <div className="admin-welcome-content">

              <span className="admin-welcome-label">
                ADMIN OVERVIEW
              </span>

              <h1>
                Welcome back, {user.name}!
              </h1>

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


          {/* ================= STAT CARDS ================= */}

          <div className="admin-stat-grid">

            <div className="admin-stat-card stat-total">

              <div className="admin-stat-icon total">
                <FileText size={23} />
              </div>

              <div className="admin-stat-content">
                <span>Total Complaints</span>
                <strong>{total}</strong>
                <small>All submitted complaints</small>
              </div>

            </div>


            <div className="admin-stat-card stat-pending">

              <div className="admin-stat-icon pending">
                <Clock3 size={23} />
              </div>

              <div className="admin-stat-content">
                <span>Pending</span>
                <strong>{pending}</strong>
                <small>Waiting for review</small>
              </div>

            </div>


            <div className="admin-stat-card stat-progress">

              <div className="admin-stat-icon progress">
                <LoaderCircle size={23} />
              </div>

              <div className="admin-stat-content">
                <span>In Progress</span>
                <strong>{inProgress}</strong>
                <small>Currently being handled</small>
              </div>

            </div>


            <div className="admin-stat-card stat-resolved">

              <div className="admin-stat-icon resolved">
                <CheckCircle size={23} />
              </div>

              <div className="admin-stat-content">
                <span>Resolved</span>
                <strong>{resolved}</strong>
                <small>Successfully completed</small>
              </div>

            </div>

          </div>


          {/* ================= CHARTS ================= */}

          <div className="admin-charts-grid">

            {/* PIE CHART */}

            <div className="admin-chart-card">

              <div className="admin-card-heading">

                <div>
                  <span className="admin-section-label">
                    ANALYTICS
                  </span>

                  <h3>Complaint Status</h3>

                  <p>
                    Current complaint distribution
                  </p>
                </div>

              </div>

              <div className="admin-pie-container">

                {statusData.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >

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
                            "#dc2626",
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

                      <Legend
                        verticalAlign="bottom"
                      />

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


            {/* BAR CHART */}

            <div className="admin-chart-card">

              <div className="admin-card-heading">

                <div>
                  <span className="admin-section-label">
                    ANALYTICS
                  </span>

                  <h3>Complaints by Category</h3>

                  <p>
                    Complaint volume by category
                  </p>
                </div>

              </div>

              <div className="admin-bar-container">

                {categoryData.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >

                    <BarChart data={categoryData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        allowDecimals={false}
                      />

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


          {/* ================= RECENT COMPLAINTS ================= */}

          <div className="admin-recent-card">

            <div className="admin-recent-header">

              <div>

                <span className="admin-section-label">
                  ACTIVITY
                </span>

                <h3>Recent Complaints</h3>

                <p>
                  Latest complaints submitted by students
                </p>

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

                <p>
                  Student complaints will appear here.
                </p>

              </div>

            ) : (

              <div className="admin-recent-list">

                {recentComplaints.map((complaint) => (

                  <div
                    className="admin-recent-row"
                    key={complaint.id}
                  >

                    <div className="admin-complaint-main">

                      <div className="admin-complaint-icon">
                        <FileText size={18} />
                      </div>

                      <div>

                        <strong>
                          {complaint.title}
                        </strong>

                        <span>
                          {complaint.category}
                          {" • "}
                          {complaint.date}
                        </span>

                      </div>

                    </div>


                    <span
                      className={`admin-status-badge ${
                        complaint.status === "Resolved"
                          ? "resolved"
                          : complaint.status === "In Progress"
                          ? "progress"
                          : complaint.status === "Rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {complaint.status}
                    </span>


                    <Link
                      to={`/admin/complaint-details/${complaint.id}`}
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

export default AdminDashboard;