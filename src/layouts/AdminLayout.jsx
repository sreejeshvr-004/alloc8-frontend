import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";

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
    } catch (err) {
      console.error("Failed to fetch pending requests");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar pendingCount={pendingCount} />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-16 p-6">
        <Outlet context={{ refreshPendingRequests: fetchPendingRequests }} />
      </main>
    </div>
  );
};

export default AdminLayout;
