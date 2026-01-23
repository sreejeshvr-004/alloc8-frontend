import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAssets from "./pages/AdminAssets";
import AdminAssetCategories from "./pages/AdminAssetCategories";
import AdminDepartments from "./pages/AdminDepartments";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import AdminRequests from "./pages/AdminRequests";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* ADMIN ROUTES (WITH SIDEBAR + LAYOUT) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />

          <Route path="users" element={<AdminUsers />} />
          <Route path="assets" element={<AdminAssets />} />
          <Route path="assets/categories" element={<AdminAssetCategories />} />
          <Route path="departments" element={<AdminDepartments />} />
        </Route>

        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
