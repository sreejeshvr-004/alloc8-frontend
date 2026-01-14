import { useEffect, useState } from "react";
import api from "../api/axios";
import HistoryModel from "./HistoryModel";

const AssetTable = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

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
      setEmployees(res.data.filter((u) => u.role === "employee"));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssets();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssets();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssets();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssets();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to complete maintenance"
      );
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case "available":
        return `${base} bg-green-100 text-green-700`;
      case "assigned":
        return `${base} bg-blue-100 text-blue-700`;
      case "maintenance":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  if (loading) {
    return <p className="text-center p-4">Loading assets...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 p-4">
        {error}
      </p>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full">
      <h3 className="text-lg font-semibold mb-4">
        Assets
      </h3>

      <div className="overflow-y-auto max-h-[70vh]">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Assigned</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500"
                >
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-2">
                    {asset.name}
                  </td>
                  <td className="p-2">
                    {asset.category}
                  </td>

                  <td className="p-2">
                    <span
                      className={getStatusBadge(
                        asset.status
                      )}
                    >
                      {asset.status}
                    </span>
                  </td>

                  <td className="p-2">
                    {asset.assignedTo?.name || "-"}
                  </td>

                  <td className="p-2 space-y-1">
                    {asset.status === "available" && (
                      <>
                        <select
                          className="border rounded text-xs w-full"
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              [asset._id]:
                                e.target.value,
                            })
                          }
                        >
                          <option value="">
                            Select employee
                          </option>
                          {employees.map((emp) => (
                            <option
                              key={emp._id}
                              value={emp._id}
                            >
                              {emp.name}
                            </option>
                          ))}
                        </select>

                        <button
                          className="bg-blue-500 text-white text-xs px-2 py-1 rounded w-full"
                          onClick={() =>
                            assignAsset(asset._id)
                          }
                        >
                          Assign
                        </button>
                      </>
                    )}

                    {asset.status === "assigned" && (
                      <button
                        className="bg-gray-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() =>
                          unassignAsset(asset._id)
                        }
                      >
                        Unassign
                      </button>
                    )}

                    {/* SEND TO MAINTENANCE */}
                    {asset.status !== "maintenance" && (
                      <button
                        className="bg-yellow-500 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() =>
                          sendToMaintenance(asset._id)
                        }
                      >
                        Send to Maintenance
                      </button>
                    )}

                    {/* COMPLETE MAINTENANCE */}
                    {asset.status === "maintenance" && (
                      <button
                        className="bg-green-600 text-white text-xs px-2 py-1 rounded w-full"
                        onClick={() =>
                          completeMaintenance(asset._id)
                        }
                      >
                        Maintenance Completed
                      </button>
                    )}

                    <button
                      className="bg-slate-600 text-white text-xs px-2 py-1 rounded w-full"
                      onClick={() =>
                        setSelectedAsset(asset)
                      }
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

      {selectedAsset && (
        <HistoryModel
          asset={selectedAsset}
          onClose={() =>
            setSelectedAsset(null)
          }
        />
      )}
    </div>
  );
};

export default AssetTable;