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
  UserRound,
} from "lucide-react";

function AdminComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const complaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    const found = complaints.find(
      (item) => item.id === id
    );

    if (!found) {
      navigate("/admin/all-complaints");
      return;
    }

    setComplaint(found);
  }, [id, navigate]);

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") return "resolved";
    if (status === "In Progress") return "progress";
    if (status === "Rejected") return "rejected";
    return "pending";
  };

  if (!user || !complaint) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  const status = complaint.status || "Pending";

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-logo">
            C
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
            <h2>
              Complaint Details
            </h2>

            <p>
              Review complete complaint information
            </p>
          </div>

          <div className="admin-topbar-right">

            <button className="admin-notification-btn">
              <Bell size={20} />
            </button>

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
                  {complaint.id}
                </span>

                <h1>
                  {complaint.title}
                </h1>

                <p>
                  Submitted on {complaint.date || "—"}
                </p>

              </div>

            </div>


            <span
              className={`admin-status-badge ${getStatusClass(
                status
              )}`}
            >
              {status}
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

                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <Tag size={17} />
                    </div>

                    <div>
                      <span>Category</span>
                      <strong>
                        {complaint.category || "Other"}
                      </strong>
                    </div>

                  </div>


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


                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <AlertCircle size={17} />
                    </div>

                    <div>
                      <span>Priority</span>
                      <strong>
                        {complaint.priority || "Medium"}
                      </strong>
                    </div>

                  </div>


                  <div className="admin-info-item">

                    <div className="admin-info-item-icon">
                      <Calendar size={17} />
                    </div>

                    <div>
                      <span>Submitted Date</span>
                      <strong>
                        {complaint.date || "—"}
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


                  {/* CONNECTOR */}

                  <div className="admin-flow-line"></div>


                  {/* UNDER REVIEW */}

                  <div
                    className={`admin-flow-item ${
                      status === "Pending"
                        ? "current"
                        : "completed"
                    }`}
                  >

                    <div className="admin-flow-icon">
                      {status === "Pending" ? (
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
                      status === "In Progress"
                        ? "current"
                        : status === "Resolved"
                        ? "completed"
                        : ""
                    }`}
                  >

                    <div className="admin-flow-icon">
                      {status === "In Progress" ? (
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
                      status === "Resolved"
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