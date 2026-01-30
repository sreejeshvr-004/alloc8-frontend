import { useEffect, useState } from "react";
import api from "../api/axios";



const HistoryModel = ({ asset, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!asset) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/assets/${asset._id}/history`);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Failed to load asset history");
      }
    };

    fetchHistory();
  }, [asset]);

  // 🔹 Backend → UI friendly mapping
  const formatAction = (action) => {
    switch (action) {
      case "assigned":
        return "Asset Assigned";
      case "unassigned":
        return "Asset Unassigned";
      case "maintenance_started":
        return "Maintenance Started";
      case "maintenance_completed":
        return "Maintenance Completed";
      default:
        return action
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const buildUsageTimeline = (history) => {
    const timeline = [];
    let current = null;

    const sorted = history
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    for (const h of sorted) {
      if (h.action === "assigned" && h.assignedTo) {
        // close previous session if any
        if (current) {
          current.end = h.createdAt;
          timeline.push(current);
        }

        current = {
          user: h.assignedTo?.name || "Unknown",
          start: h.createdAt,
          end: null,
        };
      }

      if (
        (h.action === "unassigned" || h.action === "maintenance_started") &&
        current
      ) {
        current.end = h.createdAt;
        timeline.push(current);
        current = null;
      }
    }

    // still assigned
    if (current) {
      timeline.push(current);
    }

    return timeline;
  };

  const usageTimeline = buildUsageTimeline(history);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Asset History — {asset.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* 🔹 ASSET SUMMARY (NEW – Phase 3.2.1) */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <p>
            <strong>Category:</strong> {asset.category}
          </p>
          <p>
            <strong>Serial:</strong> {asset.serialNumber}
          </p>
          <p>
            <strong>Cost:</strong> ₹{asset.assetCost || "-"}
          </p>
          <p>
            <strong>Warranty:</strong>{" "}
            {asset.warrantyExpiry
              ? new Date(asset.warrantyExpiry).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Maintenance Count:</strong> {asset.maintenanceCount ?? 0}
          </p>
          <p>
            <strong>Total Maintenance Cost:</strong> ₹
            {asset.totalMaintenanceCost ?? 0}
          </p>
        </div>

        {usageTimeline.length > 0 && (
          <div className="mb-5">
            <h4 className="font-semibold mb-2">Asset Usage Timeline</h4>
            <div className="space-y-1 text-sm text-gray-700">
              {usageTimeline.map((u, idx) => (
                <div key={idx}>
                  <strong>{u.user}</strong> —{" "}
                  {new Date(u.start).toLocaleDateString()} →{" "}
                  {u.end ? new Date(u.end).toLocaleDateString() : "Present"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY TABLE */}
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Performed By</th>
              <th className="p-2 text-left">Notes</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No history found
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{formatAction(h.action)}</td>
                  <td className="p-2">{h.performedBy?.name || "System"}</td>
                  <td className="p-2">{h.notes || "-"}</td>
                  <td className="p-2">
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="flex justify-end mt-4">
          <div className="flex justify-between mt-4">
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="bg-teal-600 text-white  px-3 py-1.5 rounded   text-sm hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModel;
