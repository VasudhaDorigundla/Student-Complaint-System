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
} from "lucide-react";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const complaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    const found = complaints.find(
      (item) => String(item.id) === String(id)
    );

    if (!found) {
      navigate("/student/my-complaints");
      return;
    }

    setComplaint(found);
  }, [id, navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  if (!complaint || !user) {
    return <div>Loading...</div>;
  }

  const status = complaint.status || "Pending";

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
                {complaint.id}
              </div>

              <h1>
                {complaint.title}
              </h1>

              <p>
                Submitted on {complaint.date}
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
                    {complaint.priority}
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
                    {complaint.date}
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


              {/* =================================================
                  STEP 1 - SUBMITTED
              ================================================= */}

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


              {/* =================================================
                  STEP 2 - UNDER REVIEW
              ================================================= */}

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


              {/* =================================================
                  STEP 3 - IN PROGRESS
              ================================================= */}

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


              {/* =================================================
                  STEP 4 - RESOLVED
              ================================================= */}

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


            {/* =================================================
                CURRENT STATUS MESSAGE
            ================================================= */}

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

                {status === "Rejected" &&
                  "Your complaint has been reviewed and rejected by the administration."}

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ComplaintDetails;