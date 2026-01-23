import { useState } from "react";
import api from "../api/axios";

const RejectRequestModal = ({ request, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token");

  const rejectRequest = async () => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    await api.put(
      `/requests/${request._id}`,
      {
        status: "rejected",
        rejectionReason: reason,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-450px shadow-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Reject Request
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          You are about to reject the request from{" "}
          <b>{request.user?.name}</b>.  
          This action cannot be undone and the employee will need to request again.
        </p>

        <textarea
          placeholder="Enter rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded p-2 text-sm mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={rejectRequest}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectRequestModal;
