import { useEffect, useState } from "react";
import api from "../api/axios";
import HistoryModel from "./HistoryModel";

import MaintenanceCompleteModal from "./MaintenanceCompleteModal";
import IssueActionModal from "./IssueActionModal";

import AssetTableToolbar from "./AssetTableToolbar";

const AssetTable = ({ onActionComplete }) => {
  const [maintenanceAsset, setMaintenanceAsset] = useState(null);
  const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [issueAsset, setIssueAsset] = useState(null);

  const [filter, setFilter] = useState("all"); // all | active | inactive | issue

  const issueCount = assets.filter((a) => a.status === "issue_reported").length;

  const token = localStorage.getItem("token");

  const handleSendToMaintenance = (asset) => {
    // Case 1: Employee reported an issue → open modal
    if (asset.status === "issue_reported") {
      setIssueAsset(asset);
      setOpenMaintenanceModal(true);
      return;
    }

    // Case 2: Admin direct maintenance → send immediately
    sendToMaintenance(asset._id, {
      reason: "Admin initiated maintenance",
      notes: "No employee issue reported",
    });
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/assets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(res.data);
    } catch (err) {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const activeEmployees = res.data.filter(
        (u) => u.role === "employee" && u.isDeleted !== true, //&& // covers boolean soft delete
        // !u.deletedAt, // covers timestamp soft delete
      );

      setEmployees(activeEmployees);
    } catch (err) {
      console.error("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  const assignAsset = async (assetId) => {
    if (!selectedUser[assetId]) {
      alert("Please select an employee");
      return;
    }

    try {
      await api.put(
        `/assets/assign/${assetId}`,
        { userId: selectedUser[assetId] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAssets();
      onActionComplete();
    } catch {
      alert("Failed to assign asset");
    }
  };

  const unassignAsset = async (id) => {
    if (!window.confirm("Unassign this asset?")) return;

    try {
      await api.put(
        `/assets/unassign/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAssets();
      onActionComplete();
    } catch {
      alert("Failed to unassign asset");
    }
  };

  const sendToMaintenance = async (id) => {
    if (!window.confirm("Send asset to maintenance?")) return;

    try {
      await api.put(
        `/assets/maintenance/${id}`,
        { reason: "Routine maintenance" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAssets();
      onActionComplete();
    } catch {
      alert("Failed to update maintenance status");
    }
  };

  // ✅ NEW: COMPLETE MAINTENANCE
  const completeMaintenance = async (id) => {
    if (!window.confirm("Mark maintenance as completed?")) return;

    try {
      await api.put(
        `/assets/maintenance/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchAssets();
      onActionComplete();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete maintenance");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-medium";

    switch (status) {
      case "available":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Available
          </span>
        );
      case "assigned":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>Assigned</span>
        );
      case "issue_reported":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            Issue Reported
          </span>
        );

      case "maintenance":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            Under Maintenance
          </span>
        );
      case "inactive":
        return (
          <span className={`${base} bg-gray-200 text-gray-600`}>Inactive</span>
        );

      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>
        );
    }
  };

  // --- UI helper functions (SAFE, no logic impact) ---  IMAGE DEMO
  const getAssetImage = () => {
    // temporary static asset image
    return "/assets/device.png";
  };

  const getEmployeeAvatar = (name = "") => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=EEF2FF&color=4F46E5&size=64`;
  };

  if (loading) {
    return <p className="text-center p-4">Loading assets...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  // ---- FILTER + SORT PIPELINE (SAFE) ----
  const filteredAssets = assets
    .filter((asset) => {
      if (filter === "active") {
        return asset.status !== "inactive";
      }
      if (filter === "available") {
        return asset.status === "available";
      }
      if (filter === "inactive") {
        return asset.status === "inactive";
      }
      if (filter === "issue") {
        return asset.status === "issue_reported";
      }
      return true; // "all"
    })
    .sort((a, b) => {
      // Always push inactive assets to bottom
      if (a.status === "inactive" && b.status !== "inactive") return 1;
      if (a.status !== "inactive" && b.status === "inactive") return -1;
      return 0;
    });

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full">
      <AssetTableToolbar
        filter={filter}
        setFilter={setFilter}
        issueCount={issueCount}
      />

      <div className="overflow-y-auto max-h-[70vh]">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-3 text-left">Asset</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Serial</th>
              <th className="p-3 text-left">Cost</th>
              <th className="p-3 text-left">Warranty</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No assets found
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr
                  key={asset._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* ASSET IMAGE + NAME */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAssetImage()}
                        alt="asset"
                        className="w-9 h-9 rounded-md border"
                      />
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-3">{asset.category}</td>

                  {/* SERIAL */}
                  <td className="p-3 text-xs text-gray-600">
                    {asset.serialNumber || "-"}
                  </td>

                  {/* COST */}
                  <td className="p-3">
                    ₹{asset.assetCost ? asset.assetCost.toLocaleString() : "-"}
                  </td>

                  {/* WARRANTY */}
                  <td className="p-3">
                    {asset.warrantyExpiry
                      ? new Date(asset.warrantyExpiry).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">{getStatusBadge(asset.status)}</td>

                  {/* ASSIGNED EMPLOYEE */}
                  <td className="p-3">
                    {asset.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={getEmployeeAvatar(asset.assignedTo.name)}
                          alt="employee"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm">{asset.assignedTo.name}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ACTIONS (UNCHANGED LOGIC) */}
                  <td className="p-3 space-y-1 w-48">
                    {asset.status === "available" && (
                      <>
                        <select
                          className="border rounded text-xs w-full"
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              [asset._id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select employee</option>
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>

                        <button
                          className="bg-blue-500 text-white text-xs px-2 py-1 rounded w-full"
                          onClick={() => assignAsset(asset._id)}
                        >
                          Assign
                        </button>
                      </>
                    )}

                    {asset.status === "assigned" && (
                      <button
                        className="bg-gray-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() => unassignAsset(asset._id)}
                      >
                        Unassign
                      </button>
                    )}

                    {["available", "assigned", "issue_reported"].includes(
                      asset.status,
                    ) && (
                      <button
                        className="bg-yellow-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() => handleSendToMaintenance(asset)}
                      >
                        Send to Maintenance
                      </button>
                    )}

                    {asset.status === "maintenance" && (
                      <button
                        className="bg-green-600 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() => setMaintenanceAsset(asset)}
                      >
                        Maintenance Completed
                      </button>
                    )}

                    <button
                      className="bg-slate-600 text-white text-xs px-2 py-1 rounded w-full"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowHistory(true);
                      }}
                    >
                      History / PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showHistory && selectedAsset && (
        <HistoryModel
          asset={selectedAsset}
          onClose={() => {
            setShowHistory(false);
            setSelectedAsset(null);
          }}
        />
      )}

      {issueAsset && (
        <IssueActionModal
          asset={issueAsset}
          onClose={() => {
            setIssueAsset(null);
            setFilter("all"); // 🔥 RESET FILTER
          }}
          onSuccess={() => {
            fetchAssets();
            onActionComplete();
            setIssueAsset(null);
            setFilter("all"); // 🔥 RESET FILTER
          }}
        />
      )}

      {maintenanceAsset && (
        <MaintenanceCompleteModal
          asset={maintenanceAsset}
          onClose={() => setMaintenanceAsset(null)}
          onSuccess={() => {
            fetchAssets();
            onActionComplete();
          }}
        />
      )}
    </div>
  );
};

export default AssetTable;
