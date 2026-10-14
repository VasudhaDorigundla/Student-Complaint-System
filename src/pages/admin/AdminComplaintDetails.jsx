import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Bell,
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

import api from "../../services/api";

function AdminComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    const token = localStorage.getItem("campuscareToken");

    if (!currentUser || currentUser.role !== "admin" || !token) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/complaints/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaint(response.data.complaint);
      } catch (error) {
        console.error(
          "Admin complaint details error:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem(
            "campuscareCurrentUser"
          );

          navigate("/login");
          return;
        }

        navigate("/admin/all-complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    localStorage.removeItem("campuscareToken");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    if (status === "IN-PROGRESS") {
      return "In Progress";
    }

    if (status === "RESOLVED") {
      return "Resolved";
    }

    return "Pending";
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") {
      return "resolved";
    }

    if (status === "IN-PROGRESS") {
      return "progress";
    }

    return "pending";
  };

  if (loading || !user || !complaint) {
    return (
      <div className="page-loading">
        Loading complaint details...
      </div>
    );
  }

  const status = complaint.status || "PENDING";

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
          ================================================= */}

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

          <Link to="/admin/dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/all-complaints"
            className="active"
          >
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

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              ADMIN PORTAL
            </span>

            <h2>
              Complaint Details
            </h2>

            <p>
              Review complete complaint information
            </p>

          </div>

          <div className="admin-topbar-right">

            <Link
              to="/notifications"
              className="admin-notification-btn"
            >
              <Bell size={20} />
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

        <section className="admin-detail-page">

          {/* BACK BUTTON */}

          <Link
            to="/admin/all-complaints"
            className="admin-detail-back"
          >
            <ArrowLeft size={17} />
            Back to All Complaints
          </Link>

          {/* HEADER CARD */}

          <div className="admin-detail-header-card">

            <div className="admin-detail-header-left">

              <div className="admin-detail-large-icon">
                <FileText size={25} />
              </div>

              <div>

                <span className="admin-detail-id">
                  {complaint._id}
                </span>

                <h1>
                  {complaint.title ||
                    "Untitled Complaint"}
                </h1>

                <p>
                  Submitted on{" "}
                  {formatDate(complaint.createdAt)}
                </p>

              </div>

            </div>

            <span
              className={`admin-status-badge ${getStatusClass(
                status
              )}`}
            >
              {getStatusLabel(status)}
            </span>

          </div>

          {/* INFORMATION */}

          <div className="admin-detail-layout">

            <div className="admin-detail-main">

              {/* COMPLAINT INFORMATION */}

              <div className="admin-info-card">

                <div className="admin-info-card-header">

                  <div>

                    <h2>
                      Complaint Information
                    </h2>

                    <p>
                      Details provided by the student
                    </p>

                  </div>

                </div>

                <div className="admin-info-grid">

                  {/* CATEGORY */}

                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <Tag size={17} />
                    </div>

                    <div>

                      <span>Category</span>

                      <strong>
                        {complaint.category ||
                          "Other"}
                      </strong>

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <MapPin size={17} />
                    </div>

                    <div>

                      <span>Location</span>

                      <strong>
                        {complaint.location ||
                          "Not specified"}
                      </strong>

                    </div>

                  </div>

                  {/* PRIORITY */}

                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <AlertCircle size={17} />
                    </div>

                    <div>

                      <span>Priority</span>

                      <strong>
                        {complaint.priority ||
                          "Medium"}
                      </strong>

                    </div>

                  </div>

                  {/* DATE */}

                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <Calendar size={17} />
                    </div>

                    <div>

                      <span>Submitted Date</span>

                      <strong>
                        {formatDate(
                          complaint.createdAt
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-info-card">

                <div className="admin-info-card-header">

                  <div>

                    <h2>
                      Complaint Description
                    </h2>

                    <p>
                      Issue reported by the student
                    </p>

                  </div>

                </div>

                <div className="admin-description-box">

                  {complaint.description ||
                    "No description provided."}

                </div>

              </div>

              {/* RESOLUTION */}

              <div className="admin-info-card">

                <div className="admin-info-card-header">

                  <div>

                    <h2>
                      Resolution
                    </h2>

                    <p>
                      Action or response provided by admin
                    </p>

                  </div>

                </div>

                <div
                  className={
                    complaint.resolution
                      ? "admin-resolution-view"
                      : "admin-no-resolution"
                  }
                >

                  {complaint.resolution ? (
                    <>
                      <CheckCircle size={19} />

                      <span>
                        {complaint.resolution}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={19} />

                      <span>
                        No resolution has been added yet.
                      </span>
                    </>
                  )}

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <aside className="admin-detail-side">

              {/* STUDENT CARD */}

              <div className="admin-info-card">

                <div className="admin-info-card-header">

                  <div>

                    <h2>
                      Student
                    </h2>

                    <p>
                      Submitted by
                    </p>

                  </div>

                </div>

                <div className="admin-student-card">

                  <div className="admin-student-avatar">

                    {(complaint.studentName ||
                      "Student")
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <strong>
                      {complaint.studentName ||
                        "Student"}
                    </strong>

                    <span>
                      Student
                    </span>

                  </div>

                </div>

              </div>

              {/* STATUS FLOW */}

              <div className="admin-info-card">

                <div className="admin-info-card-header">

                  <div>

                    <h2>
                      Status
                    </h2>

                    <p>
                      Complaint progress
                    </p>

                  </div>

                </div>

                <div className="admin-status-flow">

                  {/* SUBMITTED */}

                  <div className="admin-flow-item completed">

                    <div className="admin-flow-icon">
                      <CheckCircle size={16} />
                    </div>

                    <div>

                      <strong>
                        Submitted
                      </strong>

                      <span>
                        Complaint received
                      </span>

                    </div>

                  </div>

                  <div className="admin-flow-line"></div>

                  {/* UNDER REVIEW */}

                  <div
                    className={`admin-flow-item ${
                      status === "PENDING"
                        ? "current"
                        : "completed"
                    }`}
                  >

                    <div className="admin-flow-icon">

                      {status === "PENDING" ? (
                        <Clock size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}

                    </div>

                    <div>

                      <strong>
                        Under Review
                      </strong>

                      <span>
                        Admin reviewing
                      </span>

                    </div>

                  </div>

                  <div className="admin-flow-line"></div>

                  {/* IN PROGRESS */}

                  <div
                    className={`admin-flow-item ${
                      status === "IN-PROGRESS"
                        ? "current"
                        : status === "RESOLVED"
                        ? "completed"
                        : ""
                    }`}
                  >

                    <div className="admin-flow-icon">

                      {status === "IN-PROGRESS" ? (
                        <Clock size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}

                    </div>

                    <div>

                      <strong>
                        In Progress
                      </strong>

                      <span>
                        Action being taken
                      </span>

                    </div>

                  </div>

                  <div className="admin-flow-line"></div>

                  {/* RESOLVED */}

                  <div
                    className={`admin-flow-item ${
                      status === "RESOLVED"
                        ? "resolved-current"
                        : ""
                    }`}
                  >

                    <div className="admin-flow-icon">
                      <CheckCircle size={16} />
                    </div>

                    <div>

                      <strong>
                        Resolved
                      </strong>

                      <span>
                        Issue completed
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminComplaintDetails;