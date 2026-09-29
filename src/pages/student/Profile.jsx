import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Bell,
  Mail,
  GraduationCap,
  Building2,
  UserCircle,
  ShieldCheck,
  Edit3,
  Save,
  X,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("campuscareCurrentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "student") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    setForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      studentId: currentUser.studentId || "",
      department: currentUser.department || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      studentId: form.studentId.trim(),
      department: form.department.trim(),
    };

    localStorage.setItem(
      "campuscareCurrentUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      studentId: user.studentId || "",
      department: user.department || "",
    });

    setEditing(false);
  };

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const initial = user.name?.charAt(0).toUpperCase() || "S";

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

          <Link to="/student/my-complaints">
            <FileText size={19} />
            <span>My Complaints</span>
          </Link>

          <Link
            to="/student/profile"
            className="active"
          >
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
          MAIN
      ===================================================== */}

      <main className="student-main">

        {/* TOPBAR */}

        <header className="student-topbar">

          <div>

            <h2>My Profile</h2>

            <p>
              Manage your student account information
            </p>

          </div>


          <div className="topbar-right">

            <button className="notification-btn">
              <Bell size={20} />
            </button>

            <div className="topbar-user">

              <div className="user-avatar">
                {initial}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>Student</span>
              </div>

            </div>

          </div>

        </header>


        {/* =====================================================
            PROFILE CONTENT
        ===================================================== */}

        <section className="profile-content">


          {/* PROFILE HEADER */}

          <div className="profile-header-card">

            <div className="profile-avatar-large">
              {initial}
            </div>

            <div className="profile-header-info">

              <h1>
                {user.name}
              </h1>

              <p>
                {user.email}
              </p>

              <span className="student-role-badge">
                <ShieldCheck size={14} />
                Student Account
              </span>

            </div>

          </div>


          {/* PERSONAL INFORMATION */}

          <div className="profile-card">

            <div className="profile-card-header">

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your registered student information
                </p>

              </div>


              {!editing ? (

                <button
                  className="profile-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>

              ) : (

                <div className="profile-action-buttons">

                  <button
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    className="profile-save-btn"
                    onClick={handleSave}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>

                </div>

              )}

            </div>


            <div className="profile-form-grid">


              {/* NAME */}

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <div className="profile-input-wrapper">

                  <UserCircle size={18} />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <div className="profile-input-wrapper">

                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>


              {/* STUDENT ID */}

              <div className="profile-field">

                <label>
                  Student ID
                </label>

                <div className="profile-input-wrapper">

                  <GraduationCap size={18} />

                  <input
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>


              {/* DEPARTMENT */}

              <div className="profile-field">

                <label>
                  Department
                </label>

                <div className="profile-input-wrapper">

                  <Building2 size={18} />

                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ACCOUNT INFORMATION */}

          <div className="profile-card">

            <div className="profile-card-header">

              <div>

                <h3>
                  Account Information
                </h3>

                <p>
                  Information about your CampusCare account
                </p>

              </div>

            </div>


            <div className="account-info-grid">

              <div className="account-info-item">

                <div className="account-info-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <span>Account Type</span>
                  <strong>Student</strong>
                </div>

              </div>


              <div className="account-info-item">

                <div className="account-info-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>Registered Email</span>
                  <strong>{user.email}</strong>
                </div>

              </div>


              <div className="account-info-item">

                <div className="account-info-icon">
                  <GraduationCap size={19} />
                </div>

                <div>
                  <span>Student ID</span>
                  <strong>
                    {user.studentId || "Not provided"}
                  </strong>
                </div>

              </div>


              <div className="account-info-item">

                <div className="account-info-icon">
                  <Building2 size={19} />
                </div>

                <div>
                  <span>Department</span>
                  <strong>
                    {user.department || "Not provided"}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* SECURITY NOTICE */}

          <div className="profile-security-box">

            <div className="security-icon">
              <ShieldCheck size={22} />
            </div>

            <div>

              <h4>
                Your account is secure
              </h4>

              <p>
                Keep your account information updated and do not
                share your login credentials with others.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;