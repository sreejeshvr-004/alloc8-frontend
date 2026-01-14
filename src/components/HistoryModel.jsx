import { useEffect, useState } from "react";
import api from "../api/axios";

const HistoryModel = ({ asset, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!asset) return;

    const fetchHistory = async () => {
      const res = await api.get(`/assets/${asset._id}/history`);
      setHistory(res.data.history);
    };

    fetchHistory();
  }, [asset]);

  const formatAction = (action) => {
    switch (action) {
      case "assigned":
        return "Asset Assigned";
      case "unassigned":
        return "Asset Unassigned";
      case "maintenance_started":
        return "Sent to Maintenance";
      case "maintenance_completed":
        return "Maintenance Completed";
      default:
        return action;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Asset History — {asset.name}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Performed By</th>
              <th className="p-2 text-left">Notes</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id} className="border-t">
                <td className="p-2 font-medium">
                  {formatAction(h.action)}
                </td>
                <td className="p-2">{h.performedBy?.name}</td>
                <td className="p-2">{h.notes || "-"}</td>
                <td className="p-2">
                  {new Date(h.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModel;
