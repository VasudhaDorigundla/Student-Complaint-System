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
} from "lucide-react";

function MyComplaints() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!user || user.role !== "student") {
      navigate("/login");
      return;
    }

    setCurrentUser(user);

    const allComplaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    const studentComplaints = allComplaints.filter(
      (complaint) =>
        complaint.studentEmail === user.email ||
        complaint.studentId === user.studentId
    );

    setComplaints(studentComplaints);
  }, [navigate]);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      complaint.id
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      complaint.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

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
  });

  const categories = [
    ...new Set(
      complaints
        .map((complaint) => complaint.category)
        .filter(Boolean)
    ),
  ];

  const getStatusClass = (status) => {
    if (status === "Resolved") return "my-status resolved";
    if (status === "In Progress") return "my-status progress";
    if (status === "Rejected") return "my-status rejected";
    return "my-status pending";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Urgent") return "priority urgent";
    if (priority === "High") return "priority high";
    if (priority === "Low") return "priority low";
    return "priority medium";
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

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Rejected">
                  Rejected
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

          {/* COMPLAINTS */}

          {filteredComplaints.length === 0 ? (

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

            <div className="complaints-list">

              {filteredComplaints.map((complaint) => (

                <div
                  className="complaint-list-card"
                  key={complaint.id}
                >

                  <div className="complaint-card-top">

                    <div className="complaint-card-icon">
                      <FileText size={20} />
                    </div>

                    <div className="complaint-card-title">

                      <div className="complaint-id">
                        {complaint.id}
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
                      {complaint.status}
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
                        {complaint.date}
                      </span>
                    </div>

                    <span
                      className={getPriorityClass(
                        complaint.priority
                      )}
                    >
                      {complaint.priority} Priority
                    </span>

                  </div>

                  <div className="complaint-card-footer">

                    <span>
                      Last updated{" "}
                      {complaint.updatedAt
                        ? new Date(
                            complaint.updatedAt
                          ).toLocaleDateString("en-IN")
                        : complaint.date}
                    </span>

                    <Link
                      to={`/student/complaint-details/${complaint.id}`}
                      className="view-complaint-btn"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MyComplaints;