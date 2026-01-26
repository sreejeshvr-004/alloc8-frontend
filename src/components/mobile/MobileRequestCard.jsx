import { useState } from "react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MobileRequestCard = ({ request, onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await onApprove(request);
    setLoading(false);
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await onReject(request);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">
            {request.user?.name || "-"}
          </p>

          <p className="text-xs text-gray-500">
            {request.category} •{" "}
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded capitalize ${
            statusStyles[request.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {request.status}
        </span>
      </div>

      {/* DETAILS */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Requested Date:</span>{" "}
          {new Date(request.createdAt).toLocaleDateString()}
        </p>

        {request.asset && (
          <p>
            <span className="font-medium">Asset:</span>{" "}
            {request.asset.name}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      {request.status === "pending" && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 text-white text-xs py-2 rounded disabled:opacity-60"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 text-white text-xs py-2 rounded disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileRequestCard;
