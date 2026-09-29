import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Bell,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Mail,
  UserRound,
  CheckCircle,
  Settings,
} from "lucide-react";

function AdminProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "CampusCare Admin",
    email: "admin@campuscare.com",
    role: "admin",
  });

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "CampusCare Admin",
    email: "admin@campuscare.com",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("campuscareCurrentUser");

    if (savedUser) {
      try {
        const currentUser = JSON.parse(savedUser);

        if (currentUser.role === "admin") {
          setUser(currentUser);

          setForm({
            name: currentUser.name || "CampusCare Admin",
            email:
              currentUser.email || "admin@campuscare.com",
          });
        }
      } catch (error) {
        console.log("Admin profile session error");
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name: form.name.trim() || "CampusCare Admin",
      email:
        form.email.trim() || "admin@campuscare.com",
      role: "admin",
    };

    localStorage.setItem(
      "campuscareCurrentUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setForm({
      name: updatedUser.name,
      email: updatedUser.email,
    });

    setEditing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  const cancelEdit = () => {
    setForm({
      name: user.name,
      email: user.email,
    });

    setEditing(false);
  };

  const logout = () => {
    localStorage.removeItem("campuscareCurrentUser");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

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

          <Link to="/admin/all-complaints">
            <FileText size={19} />
            <span>All Complaints</span>
          </Link>

          <Link
            to="/admin/profile"
            className="active"
          >
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

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>
            <h2>Admin Profile</h2>
            <p>
              Manage your administrator account
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
                <strong>{user.name}</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <section className="admin-profile-content">

          {/* PROFILE HEADER */}

          <div className="admin-profile-header">

            <div className="admin-profile-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="admin-profile-header-info">

              <h1>{user.name}</h1>

              <p>{user.email}</p>

              <span className="admin-role-badge">
                <ShieldCheck size={14} />
                Administrator
              </span>

            </div>

          </div>

          {/* PERSONAL INFORMATION */}

          <div className="admin-profile-card">

            <div className="admin-profile-card-header">

              <div>
                <h2>Personal Information</h2>

                <p>
                  Update your administrator
                  profile details.
                </p>
              </div>

              {!editing && (
                <button
                  className="admin-profile-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}

            </div>

            <div className="admin-profile-form">

              {/* NAME */}

              <div className="admin-profile-field">

                <label>Full Name</label>

                <div className="admin-profile-input">

                  <UserRound size={17} />

                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}

                </div>

              </div>

              {/* EMAIL */}

              <div className="admin-profile-field">

                <label>Email Address</label>

                <div className="admin-profile-input">

                  <Mail size={17} />

                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}

                </div>

              </div>

            </div>

            {editing && (
              <div className="admin-profile-actions">

                <button
                  className="admin-profile-cancel"
                  onClick={cancelEdit}
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  className="admin-profile-save"
                  onClick={saveProfile}
                >
                  <Save size={16} />
                  Save Changes
                </button>

              </div>
            )}

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="admin-profile-card">

            <div className="admin-profile-card-header">

              <div>
                <h2>Account Information</h2>

                <p>
                  Details about your CampusCare
                  administrator account.
                </p>
              </div>

            </div>

            <div className="admin-account-grid">

              <div className="admin-account-item">

                <div className="admin-account-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <span>Account Role</span>
                  <strong>Administrator</strong>
                </div>

              </div>

              <div className="admin-account-item">

                <div className="admin-account-icon">
                  <CheckCircle size={18} />
                </div>

                <div>
                  <span>Account Status</span>
                  <strong>Active</strong>
                </div>

              </div>

              <div className="admin-account-item">

                <div className="admin-account-icon">
                  <Mail size={18} />
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{user.email}</strong>
                </div>

              </div>

              <div className="admin-account-item">

                <div className="admin-account-icon">
                  <Settings size={18} />
                </div>

                <div>
                  <span>Access Level</span>
                  <strong>Full Access</strong>
                </div>

              </div>

            </div>

          </div>

          {/* SECURITY */}

          <div className="admin-security-box">

            <div className="admin-security-icon">
              <ShieldCheck size={23} />
            </div>

            <div>

              <h3>
                Administrator Account
              </h3>

              <p>
                This account has access to manage
                student complaints, update complaint
                statuses, add resolutions and manage
                the CampusCare grievance system.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* SUCCESS POPUP */}

      {showSuccess && (
        <div className="admin-profile-success">

          <CheckCircle size={20} />

          <div>
            <strong>
              Profile updated successfully!
            </strong>

            <span>
              Your changes have been saved.
            </span>
          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProfile;