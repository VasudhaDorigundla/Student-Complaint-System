import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  FileText,
  CalendarDays,
  MapPin,
  ArrowLeft,
  Inbox,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

function MyComplaints() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      const user = JSON.parse(
        localStorage.getItem("campuscareCurrentUser") || "null"
      );

      const token = localStorage.getItem("campuscareToken");

      if (!user || user.role !== "student" || !token) {
        navigate("/login");
        return;
      }

      setCurrentUser(user);

      try {
        const response = await api.get("/complaints/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(response.data.complaints || []);
        setError("");
      } catch (error) {
        console.error(
          "Get complaints error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem("campuscareCurrentUser");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load your complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [navigate]);

  const filteredComplaints = complaints.filter(
    (complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.title
          ?.toLowerCase()
          .includes(searchText) ||
        complaint._id
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    }
  );

  const categories = [
    ...new Set(
      complaints
        .map((complaint) => complaint.category)
        .filter(Boolean)
    ),
  ];

  const getStatusText = (status) => {
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
      return "my-status resolved";
    }

    if (status === "IN-PROGRESS") {
      return "my-status progress";
    }

    return "my-status pending";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Urgent") {
      return "priority urgent";
    }

    if (priority === "High") {
      return "priority high";
    }

    if (priority === "Low") {
      return "priority low";
    }

    return "priority medium";
  };

  const getComplaintDate = (complaint) => {
    if (!complaint.createdAt) {
      return "—";
    }

    return new Date(
      complaint.createdAt
    ).toLocaleDateString("en-IN");
  };

  const getUpdatedDate = (complaint) => {
    if (!complaint.updatedAt) {
      return getComplaintDate(complaint);
    }

    return new Date(
      complaint.updatedAt
    ).toLocaleDateString("en-IN");
  };

  return (
    <div className="student-page-layout">

      {/* SIDEBAR */}

      <aside className="student-sidebar">

        <Link
          to="/student/dashboard"
          className="student-brand"
        >
          <div className="student-brand-icon">
            C
          </div>

          <div>
            <strong>CampusCare</strong>
            <span>Grievance Portal</span>
          </div>
        </Link>

        <div className="student-menu-title">
          MAIN MENU
        </div>

        <nav className="student-menu">

          <Link to="/student/dashboard">
            <span>▣</span>
            Dashboard
          </Link>

          <Link to="/student/submit-complaint">
            <span>＋</span>
            Submit Complaint
          </Link>

          <Link
            to="/student/my-complaints"
            className="active"
          >
            <span>☷</span>
            My Complaints
          </Link>

          <Link to="/student/profile">
            <span>◉</span>
            My Profile
          </Link>

        </nav>

        <div className="student-sidebar-help">
          <strong>Need Help?</strong>

          <p>
            Contact the administration if you
            need assistance with your complaint.
          </p>

          <a href="mailto:admin@campuscare.com">
            Contact Admin →
          </a>
        </div>

        <div className="student-sidebar-user">

          <div className="student-sidebar-avatar">
            {currentUser?.name
              ?.charAt(0)
              ?.toUpperCase() || "S"}
          </div>

          <div>

            <strong>
              {currentUser?.name || "Student"}
            </strong>

            <span>
              {currentUser?.department || "Student"}
            </span>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="student-main">

        {/* TOPBAR */}

        <header className="student-topbar">

          <div>
            <span className="student-top-label">
              STUDENT PORTAL
            </span>

            <h2>My Complaints</h2>
          </div>

          <div className="student-top-user">

            <div className="student-top-avatar">
              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </div>

            <div>

              <strong>
                {currentUser?.name || "Student"}
              </strong>

              <span>Student</span>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="student-page-content">

          <Link
            to="/student/dashboard"
            className="back-dashboard-link"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {/* HEADER */}

          <div className="complaints-page-header">

            <div>
              <span>COMPLAINT HISTORY</span>

              <h1>My Complaints</h1>

              <p>
                View and track all the complaints you
                have submitted.
              </p>
            </div>

            <Link
              to="/student/submit-complaint"
              className="new-complaint-btn"
            >
              + New Complaint
            </Link>

          </div>

          {/* ERROR */}

          {error && (
            <div className="complaint-form-error">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          {/* FILTER BAR */}

          <div className="complaints-filter-card">

            <div className="complaints-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="complaints-filter">

              <Filter size={15} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="IN-PROGRESS">
                  In Progress
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>
              </select>

            </div>

            <div className="complaints-filter">

              <FileText size={15} />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* COUNT */}

          {!loading && (
            <div className="complaints-result-info">

              <strong>
                {filteredComplaints.length}
              </strong>

              <span>
                {filteredComplaints.length === 1
                  ? " complaint found"
                  : " complaints found"}
              </span>

            </div>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="complaints-empty">

              <div className="empty-icon">
                <FileText size={32} />
              </div>

              <h2>
                Loading complaints...
              </h2>

              <p>
                Please wait while we load your
                complaints from the server.
              </p>

            </div>

          ) : filteredComplaints.length === 0 ? (

            /* EMPTY */

            <div className="complaints-empty">

              <div className="empty-icon">
                <Inbox size={32} />
              </div>

              <h2>
                No complaints found
              </h2>

              <p>
                {complaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "Try changing your search or filters."}
              </p>

              {complaints.length === 0 && (
                <Link
                  to="/student/submit-complaint"
                  className="new-complaint-btn"
                >
                  Submit Your First Complaint
                </Link>
              )}

            </div>

          ) : (

            /* COMPLAINT LIST */

            <div className="complaints-list">

              {filteredComplaints.map(
                (complaint) => (

                  <div
                    className="complaint-list-card"
                    key={complaint._id}
                  >

                    <div className="complaint-card-top">

                      <div className="complaint-card-icon">
                        <FileText size={20} />
                      </div>

                      <div className="complaint-card-title">

                        <div className="complaint-id">
                          {complaint._id}
                        </div>

                        <h2>
                          {complaint.title}
                        </h2>

                      </div>

                      <span
                        className={getStatusClass(
                          complaint.status
                        )}
                      >
                        {getStatusText(
                          complaint.status
                        )}
                      </span>

                    </div>

                    <p className="complaint-description">
                      {complaint.description}
                    </p>

                    <div className="complaint-card-details">

                      <div>
                        <FileText size={14} />
                        <span>
                          {complaint.category}
                        </span>
                      </div>

                      <div>
                        <MapPin size={14} />
                        <span>
                          {complaint.location}
                        </span>
                      </div>

                      <div>
                        <CalendarDays size={14} />
                        <span>
                          {getComplaintDate(
                            complaint
                          )}
                        </span>
                      </div>

                      <span
                        className={getPriorityClass(
                          complaint.priority
                        )}
                      >
                        {complaint.priority ||
                          "Medium"}{" "}
                        Priority
                      </span>

                    </div>

                    <div className="complaint-card-footer">

                      <span>
                        Last updated{" "}
                        {getUpdatedDate(
                          complaint
                        )}
                      </span>

                      <Link
                        to={`/student/complaint-details/${complaint._id}`}
                        className="view-complaint-btn"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MyComplaints;