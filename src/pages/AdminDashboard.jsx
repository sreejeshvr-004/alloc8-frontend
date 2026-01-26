import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import StatCard from "../components/StatCard";
import AssetTable from "../components/AssetTable";

import { ChevronDown, ChevronRight } from "lucide-react";
import Spinner from "../components/spinner/Spinner";
import { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";

const AdminDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(true); // ✅ NEW
  const [profileOpen, setProfileOpen] = useState(false);

  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const profileRef = useRef(null);
  useClickOutside(profileRef, () => setProfileOpen(false));


  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    };

    fetchStats();
  }, [refreshKey, token]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Spinner label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 pb-24 md:pb-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <div  ref={profileRef} className="relative">
            {/* Avatar */}
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="
      w-9 h-9 rounded-full
      bg-indigo-200 text-gray-700
      flex items-center justify-center
      font-semibold text-sm
      border border-gray-200
      hover:bg-gray-200
      transition
    "
            >
              A
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div
                className="
        absolute right-0 mt-2
        w-40 bg-white
        rounded-lg shadow-lg
        border border-blue-100
        z-50
      "
              >
                <button
                  onClick={logout}
                  className="
          w-full flex items-center gap-2
          px-4 py-2 text-sm
          text-red-600
          hover:bg-red-50
          rounded-lg
          transition
        "
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW TOGGLE */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 mb-3
             text-lg font-semibold text-gray-700
              hover:text-indigo-600 transition "
          aria-expanded={showStats}
        >
          Overview
          {showStats ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* STATS GRID */}
        {showStats && (
          <div
            className="
              grid grid-cols-2 gap-3
              sm:grid-cols-3
              lg:grid-cols-4
              mb-8
            "
          >
            <StatCard title="Total Assets" value={stats.totalAssets} />

            <StatCard
              title="Asset Value"
              value={`₹ ${stats.totalAssetValue?.toLocaleString()}`}
            />

            <StatCard
              title="Maintenance Cost"
              value={`₹ ${(stats.totalMaintenanceExpense ?? 0).toLocaleString()}`}
            />

            <StatCard title="Assigned" value={stats.assignedAssets} />
            <StatCard title="Available" value={stats.availableAssets} />
            <StatCard title="Maintenance" value={stats.maintenanceAssets} />
            <StatCard title="Requests" value={stats.totalRequests} />
            <StatCard title="Pending" value={stats.pendingRequests} />
          </div>
        )}

        {/* ASSETS TABLE */}
        <AssetTable onActionComplete={triggerRefresh} />
      </div>
    </div>
  );
};

export default AdminDashboard;
