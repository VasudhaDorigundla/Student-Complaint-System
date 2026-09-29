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
} from "lucide-react";

function AllComplaints() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // NEW:
  // Stores the status selected inside the modal.
  // It will NOT update the table until Save Resolution is clicked.
  const [selectedStatus, setSelectedStatus] = useState("");

  const [resolution, setResolution] = useState("");

  // Success popup
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const saved = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    setComplaints(saved);
  }, [navigate]);

  const saveComplaints = (updated) => {
    setComplaints(updated);

    localStorage.setItem(
      "campuscareComplaints",
      JSON.stringify(updated)
    );
  };

  // =====================================================
  // OPEN COMPLAINT
  // =====================================================

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);

    // Initially selected status = current status
    setSelectedStatus(complaint.status || "Pending");

    setResolution(complaint.resolution || "");
  };

  // =====================================================
  // SELECT STATUS ONLY
  // DOES NOT UPDATE THE COMPLAINT YET
  // =====================================================

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  // =====================================================
  // SAVE STATUS + RESOLUTION
  // =====================================================

  const saveResolution = () => {
    if (!selectedComplaint) return;

    const updated = complaints.map((item) =>
      item.id === selectedComplaint.id
        ? {
            ...item,

            // Status changes ONLY HERE
            status: selectedStatus,

            resolution: resolution,
          }
        : item
    );

    saveComplaints(updated);

    // Close modal
    setSelectedComplaint(null);

    // Clear fields
    setResolution("");
    setSelectedStatus("");

    // Show success popup
    setShowSuccess(true);

    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  // =====================================================
  // DELETE COMPLAINT
  // =====================================================

  const deleteComplaint = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    const updated = complaints.filter(
      (item) => item.id !== id
    );

    saveComplaints(updated);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
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
  // FILTER COMPLAINTS
  // =====================================================

  const filteredComplaints = complaints.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText) ||
      item.id?.toLowerCase().includes(searchText);

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

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Resolved") return "resolved";

    if (status === "In Progress") return "progress";

    if (status === "Rejected") return "rejected";

    return "pending";
  };

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
          MAIN CONTENT
          ================================================= */}

      <main className="admin-main">

        {/* TOP BAR */}

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
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            COMPLAINT CONTENT
            ================================================= */}

        <section className="admin-complaints-content">

          <div className="admin-page-heading">

            <div>

              <h1>
                Complaint Management
              </h1>

              <p>
                Review, update and resolve student complaints.
              </p>

            </div>

            <div className="admin-total-count">
              {filteredComplaints.length} Complaints
            </div>

          </div>


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


            <div className="admin-filter-select">

              <FileText size={16} />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
              >

                {categories.map((category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>

                ))}

              </select>

            </div>

          </div>


          {/* =================================================
              TABLE
              ================================================= */}

          <div className="admin-table-card">

            {filteredComplaints.length === 0 ? (

              <div className="admin-table-empty">

                <FileText size={40} />

                <h3>
                  No complaints found
                </h3>

                <p>
                  Try changing your search or filters.
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

                        <tr key={complaint.id}>

                          <td>

                            <div className="admin-table-title">

                              <div className="admin-table-icon">

                                <FileText size={17} />

                              </div>

                              <div>

                                <strong>
                                  {complaint.title}
                                </strong>

                                <span>
                                  {complaint.id}
                                </span>

                              </div>

                            </div>

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
                            {complaint.date || "—"}
                          </td>


                          <td>

                            <span
                              className={`admin-status-badge ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
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
                                    complaint.id
                                  )
                                }
                                title="Delete complaint"
                              >
                                <Trash2 size={16} />
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
          COMPLAINT DETAILS MODAL
          ================================================= */}

      {selectedComplaint && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedComplaint(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <h2>
                  Complaint Details
                </h2>

                <span>
                  {selectedComplaint.id}
                </span>

              </div>

              <button
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                <X size={19} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="admin-modal-body">


              {/* TITLE + CURRENT STATUS */}

              <div className="admin-detail-title">

                <h3>
                  {selectedComplaint.title}
                </h3>

                {/* IMPORTANT:
                    This remains the OLD status
                    until Save Resolution is clicked.
                */}

                <span
                  className={`admin-status-badge ${getStatusClass(
                    selectedComplaint.status
                  )}`}
                >
                  {selectedComplaint.status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="admin-detail-grid">

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
                    {selectedComplaint.date ||
                      "—"}
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


              {/* =================================================
                  STATUS SELECT
                  ================================================= */}

              <div className="admin-status-section">

                <label>
                  Update Status
                </label>

                <div className="admin-status-buttons">

                  <button
                    className={
                      selectedStatus === "Pending"
                        ? "status-pending selected"
                        : "status-pending"
                    }
                    onClick={() =>
                      selectStatus("Pending")
                    }
                  >
                    Pending
                  </button>


                  <button
                    className={
                      selectedStatus === "In Progress"
                        ? "status-progress selected"
                        : "status-progress"
                    }
                    onClick={() =>
                      selectStatus("In Progress")
                    }
                  >
                    In Progress
                  </button>


                  <button
                    className={
                      selectedStatus === "Resolved"
                        ? "status-resolved selected"
                        : "status-resolved"
                    }
                    onClick={() =>
                      selectStatus("Resolved")
                    }
                  >
                    Resolved
                  </button>


                  <button
                    className={
                      selectedStatus === "Rejected"
                        ? "status-rejected selected"
                        : "status-rejected"
                    }
                    onClick={() =>
                      selectStatus("Rejected")
                    }
                  >
                    Rejected
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
                    setResolution(e.target.value)
                  }
                  placeholder="Enter resolution details..."
                  rows="4"
                />

              </div>

            </div>


            {/* =================================================
                MODAL FOOTER
                ================================================= */}

            <div className="admin-modal-footer">

              <button
                className="admin-modal-cancel"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                Cancel
              </button>


              <button
                className="admin-modal-save"
                onClick={saveResolution}
              >
                Save Resolution
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          SUCCESS POPUP
          ================================================= */}

      {showSuccess && (

        <div className="admin-success-popup">

          <div className="admin-success-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <strong>
              Status updated successfully!
            </strong>

            <span>
              Complaint details have been saved.
            </span>
          </div>

        </div>

      )}

    </div>
  );
}

export default AllComplaints;