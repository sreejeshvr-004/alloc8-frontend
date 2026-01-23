import { useState } from "react";
import api from "../api/axios";

const ReportIssueModal = ({ asset, onClose, onSuccess }) => {
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!issue.trim()) {
      alert("Issue is required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/employee/assets/${asset._id}/report-issue`, {
        issue,
        notes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-3">Report Asset Issue</h3>

        <input
          placeholder="Issue (required)"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Additional notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Reporting..." : "Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
