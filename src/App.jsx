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
import { Toaster } from "react-hot-toast";

import AdminReports from "./pages/AdminReports";

import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
          <Route path="/admin/reports" element={<AdminReports />} />
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
