import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Bell,
  Search,
  Eye,
  Trash2,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

function AllComplaints() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [resolution, setResolution] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // =====================================================
  // LOAD ADMIN + COMPLAINTS
  // =====================================================

  useEffect(() => {
    const loadComplaints = async () => {
      const currentUser = JSON.parse(
        localStorage.getItem("campuscareCurrentUser") || "null"
      );

      const token = localStorage.getItem("campuscareToken");

      if (
        !currentUser ||
        currentUser.role !== "admin" ||
        !token
      ) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const response = await api.get(
          "/complaints/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaints(
          response.data.complaints || []
        );

        setError("");
      } catch (error) {
        console.error(
          "Get admin complaints error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("campuscareToken");
          localStorage.removeItem(
            "campuscareCurrentUser"
          );

          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError(
            "You do not have admin access."
          );
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load complaints."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [navigate]);

  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedStatus(
      complaint.status || "PENDING"
    );

    setResolution(
      complaint.resolution || ""
    );

    setError("");
  };

  // =====================================================
  // STATUS SELECTION
  // =====================================================

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  // =====================================================
  // SAVE STATUS + RESOLUTION
  // =====================================================

  const saveResolution = async () => {
    if (!selectedComplaint) {
      return;
    }

    const token = localStorage.getItem(
      "campuscareToken"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await api.put(
        `/complaints/admin/${selectedComplaint._id}`,
        {
          status: selectedStatus,
          resolution: resolution.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComplaint =
        response.data.complaint;

      setComplaints((previous) =>
        previous.map((item) =>
          item._id === updatedComplaint._id
            ? updatedComplaint
            : item
        )
      );

      setSelectedComplaint(null);
      setSelectedStatus("");
      setResolution("");

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Update complaint error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "campuscareToken"
        );
        localStorage.removeItem(
          "campuscareCurrentUser"
        );

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE COMPLAINT
  // =====================================================

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem(
      "campuscareToken"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.delete(
        `/complaints/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );

      if (
        selectedComplaint?._id === id
      ) {
        setSelectedComplaint(null);
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Delete complaint error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "campuscareToken"
        );
        localStorage.removeItem(
          "campuscareCurrentUser"
        );

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to delete complaint."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "campuscareCurrentUser"
    );

    localStorage.removeItem(
      "campuscareToken"
    );

    navigate("/login");
  };

  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  const getStatusText = (status) => {
    if (status === "IN-PROGRESS") {
      return "In Progress";
    }

    if (status === "RESOLVED") {
      return "Resolved";
    }

    return "Pending";
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "RESOLVED") {
      return "resolved";
    }

    if (status === "IN-PROGRESS") {
      return "progress";
    }

    return "pending";
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      complaints
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredComplaints =
    complaints.filter((item) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText) ||
        item.location
          ?.toLowerCase()
          .includes(searchText) ||
        item._id
          ?.toLowerCase()
          .includes(searchText) ||
        item.studentName
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });

  if (!user) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

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

        <header className="admin-topbar">

          <div>
            <h2>All Complaints</h2>

            <p>
              View and manage student complaints
            </p>
          </div>

          <div className="admin-topbar-right">

            <button className="admin-notification-btn">
              <Bell size={20} />
            </button>

            <div className="admin-user">

              <div className="admin-user-avatar">
                {user.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {user.name}
                </strong>

                <span>
                  Administrator
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
            ================================================= */}

        <section className="admin-complaints-content">

          <div className="admin-page-heading">

            <div>

              <h1>
                Complaint Management
              </h1>

              <p>
                Review, update and resolve
                student complaints.
              </p>

            </div>

            <div className="admin-total-count">
              {filteredComplaints.length}{" "}
              Complaints
            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="complaint-form-error">

              <AlertCircle size={17} />

              {error}

            </div>

          )}

          {/* FILTERS */}

          <div className="admin-filter-card">

            <div className="admin-search-box">

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

            <div className="admin-filter-select">

              <Filter size={16} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
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

            <div className="admin-filter-select">

              <FileText size={16} />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
              >

                {categories.map(
                  (category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category === "All"
                        ? "All Categories"
                        : category}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

          {/* TABLE */}

          <div className="admin-table-card">

            {loading ? (

              <div className="admin-table-empty">

                <FileText size={40} />

                <h3>
                  Loading complaints...
                </h3>

                <p>
                  Fetching complaints
                  from MongoDB.
                </p>

              </div>

            ) : filteredComplaints.length ===
              0 ? (

              <div className="admin-table-empty">

                <FileText size={40} />

                <h3>
                  No complaints found
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

              </div>

            ) : (

              <div className="admin-table-wrapper">

                <table className="admin-complaints-table">

                  <thead>

                    <tr>

                      <th>
                        Complaint
                      </th>

                      <th>
                        Student
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Location
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredComplaints.map(
                      (complaint) => (

                        <tr
                          key={
                            complaint._id
                          }
                        >

                          <td>

                            <div className="admin-table-title">

                              <div className="admin-table-icon">
                                <FileText
                                  size={17}
                                />
                              </div>

                              <div>

                                <strong>
                                  {complaint.title ||
                                    "Complaint"}
                                </strong>

                                <span>
                                  {complaint._id}
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>
                            {complaint.studentName ||
                              complaint.student?.name ||
                              "Student"}
                          </td>

                          <td>
                            {complaint.category ||
                              "Other"}
                          </td>

                          <td>
                            {complaint.location ||
                              "Not specified"}
                          </td>

                          <td>
                            {formatDate(
                              complaint.createdAt
                            )}
                          </td>

                          <td>

                            <span
                              className={`admin-status-badge ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {getStatusText(
                                complaint.status
                              )}
                            </span>

                          </td>

                          <td>

                            <div className="admin-table-actions">

                              <button
                                className="admin-action-view"
                                onClick={() =>
                                  openDetails(
                                    complaint
                                  )
                                }
                                title="View complaint"
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                className="admin-action-delete"
                                onClick={() =>
                                  deleteComplaint(
                                    complaint._id
                                  )
                                }
                                title="Delete complaint"
                                disabled={
                                  deleting
                                }
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </main>

      {/* =================================================
          DETAILS MODAL
          ================================================= */}

      {selectedComplaint && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            !saving &&
            setSelectedComplaint(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <h2>
                  Complaint Details
                </h2>

                <span>
                  {selectedComplaint._id}
                </span>

              </div>

              <button
                onClick={() =>
                  !saving &&
                  setSelectedComplaint(
                    null
                  )
                }
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <div className="admin-modal-body">

              {/* TITLE */}

              <div className="admin-detail-title">

                <h3>
                  {selectedComplaint.title ||
                    "Complaint"}
                </h3>

                <span
                  className={`admin-status-badge ${getStatusClass(
                    selectedComplaint.status
                  )}`}
                >
                  {getStatusText(
                    selectedComplaint.status
                  )}
                </span>

              </div>

              {/* STUDENT */}

              <div className="admin-detail-grid">

                <div>

                  <span>
                    Student
                  </span>

                  <strong>
                    {selectedComplaint.studentName ||
                      selectedComplaint.student?.name ||
                      "Student"}
                  </strong>

                </div>

                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {selectedComplaint.category ||
                      "Other"}
                  </strong>

                </div>

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedComplaint.location ||
                      "Not specified"}
                  </strong>

                </div>

                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    {selectedComplaint.priority ||
                      "Medium"}
                  </strong>

                </div>

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedComplaint.createdAt
                    )}
                  </strong>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-detail-description">

                <label>
                  Description
                </label>

                <p>
                  {selectedComplaint.description ||
                    "No description provided."}
                </p>

              </div>

              {/* STATUS */}

              <div className="admin-status-section">

                <label>
                  Update Status
                </label>

                <div className="admin-status-buttons">

                  <button
                    className={
                      selectedStatus ===
                      "PENDING"
                        ? "status-pending selected"
                        : "status-pending"
                    }
                    onClick={() =>
                      selectStatus(
                        "PENDING"
                      )
                    }
                    disabled={saving}
                  >
                    Pending
                  </button>

                  <button
                    className={
                      selectedStatus ===
                      "IN-PROGRESS"
                        ? "status-progress selected"
                        : "status-progress"
                    }
                    onClick={() =>
                      selectStatus(
                        "IN-PROGRESS"
                      )
                    }
                    disabled={saving}
                  >
                    In Progress
                  </button>

                  <button
                    className={
                      selectedStatus ===
                      "RESOLVED"
                        ? "status-resolved selected"
                        : "status-resolved"
                    }
                    onClick={() =>
                      selectStatus(
                        "RESOLVED"
                      )
                    }
                    disabled={saving}
                  >
                    Resolved
                  </button>

                </div>

              </div>

              {/* RESOLUTION */}

              <div className="admin-resolution">

                <label>
                  Resolution / Admin Note
                </label>

                <textarea
                  value={resolution}
                  onChange={(e) =>
                    setResolution(
                      e.target.value
                    )
                  }
                  placeholder="Enter resolution details..."
                  rows="4"
                  disabled={saving}
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="admin-modal-footer">

              <button
                className="admin-modal-cancel"
                onClick={() =>
                  setSelectedComplaint(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="admin-modal-save"
                onClick={saveResolution}
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Resolution"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* SUCCESS */}

      {showSuccess && (

        <div className="admin-success-popup">

          <div className="admin-success-icon">

            <CheckCircle size={20} />

          </div>

          <div>

            <strong>
              Complaint updated successfully!
            </strong>

            <span>
              Changes have been saved to MongoDB.
            </span>

          </div>

        </div>

      )}

    </div>
  );
}

export default AllComplaints;