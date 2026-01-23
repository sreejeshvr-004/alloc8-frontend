import { useEffect, useState } from "react";
import api from "../api/axios";

const IssueActionModal = ({ asset, onClose, onSuccess }) => {
  const token = localStorage.getItem("token");

  if (!asset?.issue) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow">
          No issue details found.
        </div>
      </div>
    );
  }

  const sendToMaintenance = async () => {
    await api.put(
      `/assets/maintenance/${asset._id}`,
      {
        reason: asset.issue.type,
        notes: asset.issue.description,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Issue Report — {asset.name}</h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="text-sm space-y-2 text-gray-700">
          <p>
            <b>Issue:</b> {asset.issue.type}
          </p>
          <p>
            <b>Description:</b> {asset.issue.description}
          </p>
          <p>
            <b>Reported On:</b>{" "}
            {new Date(asset.issue.reportedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>

          <button
            onClick={sendToMaintenance}
            className="bg-yellow-600 text-white px-4 py-1 rounded"
          >
            Send to Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueActionModal;
