import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminBottomNav from "../components/AdminBottomNav";

const AdminLayout = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get("/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pending = res.data.filter(
        (r) => r.status === "pending"
      ).length;

      setPendingCount(pending);
    } catch {
      console.error("Failed to fetch pending requests");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <AdminSidebar pendingCount={pendingCount} />

      {/* Mobile Bottom Nav */}
      <AdminBottomNav pendingCount={pendingCount} />

      {/* Main Content */}
      <main className="md:ml-16 p-4 md:p-6 pb-20 md:pb-6">
        <Outlet context={{ refreshPendingRequests: fetchPendingRequests }} />
      </main>
    </div>
  );
};

export default AdminLayout;
