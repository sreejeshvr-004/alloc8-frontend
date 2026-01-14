import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import StatCard from "../components/StatCard";
import AssetTable from "../components/AssetTable";
import RequestTable from "../components/RequestTable";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          {/* LEFT NAV */}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-800 mr-6">
              Admin Dashboard
            </h2>

            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/assets")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Manage Assets
            </button>
          </div>

          {/* RIGHT ACTION */}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Assets" value={stats.totalAssets} />
          <StatCard title="Assigned Assets" value={stats.assignedAssets} />
          <StatCard title="Available Assets" value={stats.availableAssets} />
          <StatCard
            title="Maintenance Assets"
            value={stats.maintenanceAssets}
          />
          <StatCard title="Total Requests" value={stats.totalRequests} />
          <StatCard title="Pending Requests" value={stats.pendingRequests} />
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetTable />
          <RequestTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;