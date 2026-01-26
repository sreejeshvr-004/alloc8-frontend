import { useState } from "react";
import api from "../api/axios";

const MaintenanceCompleteModal = ({ asset, onClose, onSuccess }) => {
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!cost) {
      alert("Maintenance cost is required");
      return;
    }

    if (!asset?._id) {
      alert("Asset ID missing. Cannot complete maintenance.");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/assets/maintenance/${asset._id}/complete`, {
        cost: Number(cost),
        vendor,
        notes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete maintenance");
    } finally {
      setLoading(false);
    }
  };

  const activeMaintenance = asset?.maintenance?.find((m) => m.isActive);
  const issueReason = activeMaintenance?.issue;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Complete Maintenance</h3>
        {issueReason && (
          <div className="text-sm text-gray-600 bg-gray-50 border rounded p-2">
            <span className="font-medium">Issue Reported:</span> {issueReason}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="number"
            placeholder="Maintenance cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Vendor name"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Admin notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Saving..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCompleteModal;
