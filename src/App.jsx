import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// PUBLIC
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// STUDENT
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import SubmitComplaint from "./pages/student/SubmitComplaint.jsx";
import MyComplaints from "./pages/student/MyComplaints.jsx";
import ComplaintDetails from "./pages/student/ComplaintDetails.jsx";
import Profile from "./pages/student/Profile.jsx";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AllComplaints from "./pages/admin/AllComplaints.jsx";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

// COMMON
import Notifications from "./pages/Notifications.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/submit-complaint"
          element={<SubmitComplaint />}
        />

        <Route
          path="/student/my-complaints"
          element={<MyComplaints />}
        />

        <Route
          path="/student/complaint-details/:id"
          element={<ComplaintDetails />}
        />

        <Route
          path="/student/profile"
          element={<Profile />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/all-complaints"
          element={<AllComplaints />}
        />

        <Route
          path="/admin/complaint-details/:id"
          element={<AdminComplaintDetails />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        {/* COMMON */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;