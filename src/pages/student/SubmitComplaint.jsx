import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function SubmitComplaint() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("campuscareCurrentUser") || "null"
  );

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    priority: "Medium",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (
      !form.title.trim() ||
      !form.category ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const complaints = JSON.parse(
      localStorage.getItem("campuscareComplaints") || "[]"
    );

    const now = new Date();

    const complaint = {
      id: `CMP${Date.now()}`,
      studentId: currentUser.studentId || "",
      studentEmail: currentUser.email,
      studentName: currentUser.name,

      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      priority: form.priority,
      description: form.description.trim(),

      status: "Pending",

      date: now.toLocaleDateString("en-IN"),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),

      timeline: [
        {
          status: "Submitted",
          date: now.toISOString(),
          note: "Complaint submitted successfully.",
        },
      ],
    };

    localStorage.setItem(
      "campuscareComplaints",
      JSON.stringify([complaint, ...complaints])
    );

    const notifications = JSON.parse(
      localStorage.getItem("campuscareNotifications") || "[]"
    );

    notifications.unshift({
      id: Date.now(),
      studentEmail: currentUser.email,
      title: "Complaint submitted",
      message: `${complaint.id} has been submitted successfully.`,
      date: now.toISOString(),
      read: false,
    });

    localStorage.setItem(
      "campuscareNotifications",
      JSON.stringify(notifications)
    );

    setSuccess(true);

    setTimeout(() => {
      navigate(`/student/complaint-details/${complaint.id}`);
    }, 800);
  };

  return (
    <div className="student-page-layout">

      {/* SIDEBAR */}

      <aside className="student-sidebar">

        <Link to="/student/dashboard" className="student-brand">
          <div className="student-brand-icon">C</div>

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

          <Link
            to="/student/submit-complaint"
            className="active"
          >
            <span>＋</span>
            Submit Complaint
          </Link>

          <Link to="/student/my-complaints">
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
            {currentUser?.name?.charAt(0)?.toUpperCase() || "S"}
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

        {/* TOP BAR */}

        <header className="student-topbar">

          <div>
            <span className="student-top-label">
              STUDENT PORTAL
            </span>

            <h2>Submit Complaint</h2>
          </div>

          <div className="student-top-user">

            <div className="student-top-avatar">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "S"}
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

          <div className="complaint-page-header">

            <div>
              <span>NEW COMPLAINT</span>

              <h1>
                Report a Campus Issue
              </h1>

              <p>
                Provide the details below so the administration
                can review and resolve your concern.
              </p>
            </div>

            <div className="complaint-header-icon">
              <FileText size={30} />
            </div>

          </div>

          {/* FORM CARD */}

          <div className="complaint-form-card">

            <div className="form-card-heading">
              <div>
                <h2>Complaint Information</h2>
                <p>
                  Fields marked with * are required.
                </p>
              </div>

              <div className="required-note">
                * Required
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* TITLE */}

              <div className="form-field full">

                <label>
                  Complaint Title <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Hostel water supply problem"
                />

              </div>

              {/* CATEGORY + LOCATION */}

              <div className="form-row">

                <div className="form-field">

                  <label>
                    Category <span>*</span>
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Hostel">
                      Hostel
                    </option>

                    <option value="Classroom">
                      Classroom
                    </option>

                    <option value="Laboratory">
                      Laboratory
                    </option>

                    <option value="Internet">
                      Internet
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Library">
                      Library
                    </option>

                    <option value="Cafeteria">
                      Cafeteria
                    </option>

                    <option value="Security">
                      Security
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-field">

                  <label>
                    Location <span>*</span>
                  </label>

                  <div className="input-with-icon">

                    <MapPin size={17} />

                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Example: Block A, Room 204"
                    />

                  </div>

                </div>

              </div>

              {/* PRIORITY */}

              <div className="form-field">

                <label>
                  Priority
                </label>

                <div className="priority-options">

                  {["Low", "Medium", "High", "Urgent"].map(
                    (priority) => (
                      <label
                        key={priority}
                        className={
                          form.priority === priority
                            ? `priority-option selected ${priority.toLowerCase()}`
                            : "priority-option"
                        }
                      >

                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={
                            form.priority === priority
                          }
                          onChange={handleChange}
                        />

                        <span>
                          {priority}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="form-field">

                <label>
                  Description <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue clearly. Include any useful details that can help the administration understand the problem."
                  rows="6"
                />

                <small>
                  Please provide enough information to help us
                  understand and resolve the issue.
                </small>

              </div>

              {/* ERROR */}

              {error && (

                <div className="complaint-form-error">

                  <AlertCircle size={17} />

                  {error}

                </div>

              )}

              {/* SUCCESS */}

              {success && (

                <div className="complaint-form-success">

                  <CheckCircle size={17} />

                  Complaint submitted successfully.
                  Redirecting...

                </div>

              )}

              {/* BUTTONS */}

              <div className="complaint-form-actions">

                <Link
                  to="/student/dashboard"
                  className="cancel-complaint-btn"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="submit-complaint-btn"
                  disabled={success}
                >
                  <Send size={16} />

                  {success
                    ? "Submitted"
                    : "Submit Complaint"}
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

    </div>
  );
}

export default SubmitComplaint;