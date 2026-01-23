import { useEffect, useState } from "react";
import api from "../api/axios";
import ApproveRequestModal from "./ApporveRequestModal";
import RejectRequestModal from "./RejectRequestModal";

const RequestTable = ({ onActionComplete }) => {
  const [rejectRequest, setRejectRequest] = useState(null);

  const [approveRequest, setApproveRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    const res = await api.get("/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    let payload = { status };

    if (status === "rejected") {
      const reason = prompt("Enter rejection reason (optional):");
      payload.rejectionReason = reason || "Not approved by admin";
    }

    await api.put(`/requests/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRequests();
    onActionComplete();
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-md font-semibold mb-4">Pending Requests</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Requested By</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Requested Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No pending requests
                </td>
              </tr>
            ) : (
              pendingRequests.map((req) => (
                <tr key={req._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.user?.name}</td>
                  <td className="p-3">{req.assetCategory}</td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                      pending
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setApproveRequest(req)}
                      className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectRequest(req)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {approveRequest && (
        <ApproveRequestModal
          request={approveRequest}
          onClose={() => setApproveRequest(null)}
          onSuccess={fetchRequests}
        />
      )}

      {rejectRequest && (
        <RejectRequestModal
          request={rejectRequest}
          onClose={() => setRejectRequest(null)}
          onSuccess={() => {
            fetchRequests();
            onActionComplete();
          }}
        />
      )}
    </div>
  );
};

export default RequestTable;
