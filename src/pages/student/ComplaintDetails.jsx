import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Send,
  Search,
  Wrench,
  CheckCircle,
  Bell,
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComplaint = async () => {
      const currentUser = JSON.parse(
        localStorage.getItem("campuscareCurrentUser") || "null"
      );

      const token = localStorage.getItem("campuscareToken");

      if (!currentUser || !token) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const response = await api.get(`/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaint(response.data.complaint);
        setError("");
      } catch (error) {
        console.error("Get complaint details error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem("campuscareCurrentUser");

          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError(
            "You are not allowed to view this complaint."
          );
        } else if (error.response?.status === 404) {
          setError("Complaint not found.");
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load complaint details."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id, navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    localStorage.removeItem("campuscareToken");

    navigate("/login");
  };

  /*
    Convert backend MongoDB status
    to the display status used by the UI.
  */

  const getStatusText = (backendStatus) => {
    if (backendStatus === "IN-PROGRESS") {
      return "In Progress";
    }

    if (backendStatus === "RESOLVED") {
      return "Resolved";
    }

    return "Pending";
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="student-layout">
        <aside className="student-sidebar">

          <div className="sidebar-brand">
            <div className="sidebar-logo">
              C
            </div>

            <div>
              <strong>CampusCare</strong>
              <span>Grievance Portal</span>
            </div>
          </div>

        </aside>

        <main className="student-main">

          <header className="student-topbar">
            <div>
              <h2>Complaint Details</h2>
              <p>
                View your complaint status and updates
              </p>
            </div>
          </header>

          <section className="details-content">

            <div className="complaints-empty">

              <div className="empty-icon">
                <FileText size={32} />
              </div>

              <h2>
                Loading complaint...
              </h2>

              <p>
                Please wait while we load the complaint
                from the server.
              </p>

            </div>

          </section>

        </main>
      </div>
    );
  }

  if (error || !complaint || !user) {
    return (
      <div className="student-layout">

        <aside className="student-sidebar">

          <div className="sidebar-brand">

            <div className="sidebar-logo">
              C
            </div>

            <div>
              <strong>CampusCare</strong>
              <span>Grievance Portal</span>
            </div>

          </div>

        </aside>

        <main className="student-main">

          <header className="student-topbar">

            <div>
              <h2>Complaint Details</h2>

              <p>
                View your complaint status and updates
              </p>
            </div>

          </header>

          <section className="details-content">

            <div className="complaints-empty">

              <div className="empty-icon">
                <AlertCircle size={32} />
              </div>

              <h2>
                Unable to load complaint
              </h2>

              <p>
                {error || "Complaint not found."}
              </p>

              <Link
                to="/student/my-complaints"
                className="new-complaint-btn"
              >
                Back to My Complaints
              </Link>

            </div>

          </section>

        </main>

      </div>
    );
  }

  const status = getStatusText(complaint.status);

  /*
    STATUS FLOW

    Pending:
    Submitted = completed
    Under Review = current
    In Progress = pending
    Resolved = pending

    In Progress:
    Submitted = completed
    Under Review = completed
    In Progress = current
    Resolved = pending

    Resolved:
    All = completed
  */

  const submittedCompleted =
    status === "Pending" ||
    status === "In Progress" ||
    status === "Resolved";

  const reviewCurrent = status === "Pending";

  const reviewCompleted =
    status === "In Progress" ||
    status === "Resolved";

  const progressCurrent = status === "In Progress";

  const progressCompleted = status === "Resolved";

  const resolvedCurrent = status === "Resolved";

  return (
    <div className="student-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="student-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            C
          </div>

          <div>
            <strong>CampusCare</strong>
            <span>Grievance Portal</span>
          </div>

        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          <Link to="/student/dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link to="/student/submit-complaint">
            <PlusCircle size={19} />
            <span>Submit Complaint</span>
          </Link>

          <Link
            to="/student/my-complaints"
            className="active"
          >
            <FileText size={19} />
            <span>My Complaints</span>
          </Link>

          <Link to="/student/profile">
            <User size={19} />
            <span>Profile</span>
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <button onClick={logout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="student-main">

        {/* TOPBAR */}

        <header className="student-topbar">

          <div>

            <h2>Complaint Details</h2>

            <p>
              View your complaint status and updates
            </p>

          </div>

          <div className="topbar-right">

            <button className="notification-btn">
              <Bell size={20} />
            </button>

            <div className="topbar-user">

              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>Student</span>
              </div>

            </div>

          </div>

        </header>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <section className="details-content">

          {/* =================================================
              BACK TO MY COMPLAINTS
          ================================================= */}

          <div className="details-back-box">

            <Link
              to="/student/my-complaints"
              className="details-back-link"
            >

              <ArrowLeft size={17} />

              <span>
                Back to My Complaints
              </span>

            </Link>

          </div>


          {/* =================================================
              COMPLAINT HEADER
          ================================================= */}

          <div className="complaint-detail-header">

            <div className="complaint-header-info">

              <div className="detail-id">
                {complaint._id}
              </div>

              <h1>
                {complaint.title}
              </h1>

              <p>
                Submitted on{" "}
                {formatDate(complaint.createdAt)}
              </p>

            </div>

            <span
              className={`detail-status ${
                status === "Resolved"
                  ? "resolved"
                  : status === "In Progress"
                  ? "in-progress"
                  : "pending"
              }`}
            >
              {status}
            </span>

          </div>


          {/* =================================================
              COMPLAINT INFORMATION
          ================================================= */}

          <div className="detail-card">

            <div className="detail-card-title">

              <FileText size={20} />

              <span>
                Complaint Information
              </span>

            </div>

            <div className="description-box">
              {complaint.description}
            </div>

            <div className="info-grid">

              {/* CATEGORY */}

              <div className="info-item">

                <div className="info-icon">
                  <FileText size={18} />
                </div>

                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {complaint.category}
                  </strong>

                </div>

              </div>


              {/* LOCATION */}

              <div className="info-item">

                <div className="info-icon">
                  <Send size={18} />
                </div>

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {complaint.location}
                  </strong>

                </div>

              </div>


              {/* PRIORITY */}

              <div className="info-item">

                <div className="info-icon">
                  <Wrench size={18} />
                </div>

                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    {complaint.priority || "Medium"}
                  </strong>

                </div>

              </div>


              {/* SUBMITTED */}

              <div className="info-item">

                <div className="info-icon">
                  <CheckCircle size={18} />
                </div>

                <div>

                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(complaint.createdAt)}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              STATUS FLOW
          ================================================= */}

          <div className="detail-card">

            <div className="detail-card-title">

              <CheckCircle size={20} />

              <span>
                Complaint Status
              </span>

            </div>


            <div className="new-status-flow">

              {/* STEP 1 - SUBMITTED */}

              <div
                className={`new-flow-step ${
                  submittedCompleted
                    ? "completed"
                    : ""
                }`}
              >

                <div className="new-flow-icon">

                  {submittedCompleted ? (
                    <CheckCircle size={22} />
                  ) : (
                    <Send size={22} />
                  )}

                </div>

                <strong>
                  Submitted
                </strong>

                <span>
                  Complaint received
                </span>

              </div>


              {/* LINE 1 */}

              <div
                className={`new-flow-line ${
                  reviewCompleted ||
                  reviewCurrent
                    ? "active"
                    : ""
                }`}
              />


              {/* STEP 2 - UNDER REVIEW */}

              <div
                className={`new-flow-step ${
                  reviewCurrent
                    ? "current"
                    : reviewCompleted
                    ? "completed"
                    : ""
                }`}
              >

                <div className="new-flow-icon">

                  {reviewCompleted ? (
                    <CheckCircle size={22} />
                  ) : (
                    <Search size={22} />
                  )}

                </div>

                <strong>
                  Under Review
                </strong>

                <span>
                  Admin reviewing
                </span>

              </div>


              {/* LINE 2 */}

              <div
                className={`new-flow-line ${
                  progressCompleted ||
                  progressCurrent
                    ? "active"
                    : ""
                }`}
              />


              {/* STEP 3 - IN PROGRESS */}

              <div
                className={`new-flow-step ${
                  progressCurrent
                    ? "current"
                    : progressCompleted
                    ? "completed"
                    : ""
                }`}
              >

                <div className="new-flow-icon">

                  {progressCompleted ? (
                    <CheckCircle size={22} />
                  ) : (
                    <Wrench size={22} />
                  )}

                </div>

                <strong>
                  In Progress
                </strong>

                <span>
                  Issue being handled
                </span>

              </div>


              {/* LINE 3 */}

              <div
                className={`new-flow-line ${
                  resolvedCurrent
                    ? "active"
                    : ""
                }`}
              />


              {/* STEP 4 - RESOLVED */}

              <div
                className={`new-flow-step ${
                  resolvedCurrent
                    ? "completed"
                    : ""
                }`}
              >

                <div className="new-flow-icon">

                  <CheckCircle size={22} />

                </div>

                <strong>
                  Resolved
                </strong>

                <span>
                  Issue resolved
                </span>

              </div>

            </div>


            {/* CURRENT STATUS MESSAGE */}

            <div
              className={`new-current-status ${
                status === "Resolved"
                  ? "status-resolved"
                  : status === "In Progress"
                  ? "status-progress"
                  : "status-pending"
              }`}
            >

              <strong>
                Current Status: {status}
              </strong>

              <p>

                {status === "Pending" &&
                  "Your complaint has been submitted and is waiting for administrative review."}

                {status === "In Progress" &&
                  "The administration is currently working on your complaint."}

                {status === "Resolved" &&
                  "Your complaint has been resolved successfully."}

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ComplaintDetails;