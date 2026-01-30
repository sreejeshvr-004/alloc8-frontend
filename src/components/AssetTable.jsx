import { useEffect, useState } from "react";
import api from "../api/axios";
import HistoryModel from "./HistoryModel";

import MaintenanceCompleteModal from "./MaintenanceCompleteModal";
import IssueActionModal from "./IssueActionModal";
import ConfirmModal from "./ConfirmModal";

import AssetTableToolbar from "./AssetTableToolbar";
import MobileAssetRow from "./mobile/MobileAssetRow";

import { assetImageUrl } from "../utils/assetImage";

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

  const [confirm, setConfirm] = useState({
    open: false,
    action: null,
    asset: null,
  });
  const closeConfirm = () =>
    setConfirm({ open: false, action: null, asset: null });

  const [issueAsset, setIssueAsset] = useState(null);

  const [filter, setFilter] = useState("all"); // all | active | inactive | issue

  const issueCount = assets.filter((a) => a.status === "issue_reported").length;
  const returnCount = assets.filter(
    (a) => a.status === "return_requested",
  ).length;

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
    // if (!window.confirm("Unassign this asset?")) return;

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
    // if (!window.confirm("Send asset to maintenance?")) return;

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
    // if (!window.confirm("Mark maintenance as completed?")) return;

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
      case "return_requested":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            Return Requested
          </span>
        );

      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>
        );
    }
  };

  // ---  DB IMAGE else IMAGE DEMO
  const getAssetImage = (asset) => {
    if (asset.images && asset.images.length > 0) {
      return assetImageUrl(asset.images[0]); // primary image
    }
    return "/assets/device.png"; // fallback
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
      if (filter === "return") {
        return asset.status === "return_requested";
      }

      return true; // "all"
    })
    .sort((a, b) => {
      // Always push inactive assets to bottom
      if (a.status === "inactive" && b.status !== "inactive") return 1;
      if (a.status !== "inactive" && b.status === "inactive") return -1;
      return 0;
    });

  const handleConfirm = async () => {
    const { action, asset } = confirm;
    closeConfirm();

    if (!asset) return;

    if (action === "UNASSIGN") {
      await unassignAsset(asset._id);
    }

    if (action === "SEND_MAINTENANCE") {
      handleSendToMaintenance(asset);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full">
      <AssetTableToolbar
        filter={filter}
        setFilter={setFilter}
        issueCount={issueCount}
        returnCount={returnCount}
      />

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-275 w-full text-sm table-fixed">
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
                        src={getAssetImage(asset)}
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

                    {["assigned", "return_requested"].includes(
                      asset.status,
                    ) && (
                      <button
                        className="bg-gray-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() =>
                          setConfirm({
                            open: true,
                            action: "UNASSIGN",
                            asset,
                          })
                        }
                      >
                        Unassign
                      </button>
                    )}

                    {["available", "assigned", "issue_reported"].includes(
                      asset.status,
                    ) && (
                      <button
                        className="bg-yellow-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() =>
                          setConfirm({
                            open: true,
                            action: "SEND_MAINTENANCE",
                            asset,
                          })
                        }
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
                      History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {filteredAssets.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No assets found</p>
        ) : (
          filteredAssets.map((asset) => (
            <MobileAssetRow
              key={asset._id}
              asset={asset}
              employees={employees}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              getStatusBadge={getStatusBadge}
              getAssetImage={getAssetImage}
              getEmployeeAvatar={getEmployeeAvatar}
              onAssign={assignAsset}
              onUnassign={() =>
                setConfirm({ open: true, action: "UNASSIGN", asset })
              }
              onSendToMaintenance={() =>
                setConfirm({ open: true, action: "SEND_MAINTENANCE", asset })
              }
              onCompleteMaintenance={() => setMaintenanceAsset(asset)}
              onViewHistory={() => {
                setSelectedAsset(asset);
                setShowHistory(true);
              }}
            />
          ))
        )}
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

      <ConfirmModal
        open={confirm.open}
        title={
          confirm.action === "UNASSIGN"
            ? "Unassign Asset?"
            : "Send Asset to Maintenance?"
        }
        message={
          confirm.action === "UNASSIGN"
            ? `This will remove the asset from ${confirm.asset?.assignedTo?.name}.`
            : "The asset will be marked under maintenance."
        }
        confirmText={confirm.action === "UNASSIGN" ? "Unassign" : "Send"}
        confirmVariant={confirm.action === "UNASSIGN" ? "danger" : "warning"}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default AssetTable;
