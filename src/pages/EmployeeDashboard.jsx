import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

import EmployeeMyAssets from "../components/EmployeeMyAssets";
import ReportIssueModal from "../components/ReportIssueModal";
import toast from "react-hot-toast";



const categories = ["Laptop", "Mobile", "Keyboard", "Monitor", "Mouse"];

const EmployeeDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [assetCategory, setAssetCategory] = useState("");
  const [reason, setReason] = useState("");
  const [accordionOpen, setAccordionOpen] = useState(false);

  const [myAssets, setMyAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const { logout } = useAuth();

  const fetchMyAssets = async () => {
    const res = await api.get("/users/me/assets");
    setMyAssets(res.data);
  };
  const handleIssueReported = () => {
  fetchMyAssets(); // refresh assets after issue
};


  useEffect(() => {
    fetchMyAssets();
  }, []);

  const fetchMyRequests = async () => {
    const res = await api.get("/requests/my");
    setRequests(res.data || []);
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

const createRequest = async (e) => {
  e.preventDefault();

  if (!assetCategory) {
    toast.error("Please select an asset category");
    return;
  }

  try {
    await api.post("/requests", {
      assetCategory,
      reason,
    });

    // ✅ SUCCESS NOTIFICATION
    toast.success("Request sent successfully");

    setAssetCategory("");
    setReason("");
    fetchMyRequests();
  } catch (error) {
    toast.error("Failed to send request");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
        <EmployeeMyAssets
      assets={myAssets}
      onReport={(asset) => setSelectedAsset(asset)}
    />
      {/* REQUEST FORM */}
      <div className="bg-white p-6 mt-4 rounded-lg shadow mb-8 max-w-xl">
        <h3 className="text-lg font-semibold mb-4">Request an Asset</h3>

        <form onSubmit={createRequest} className="space-y-4">
          {/* ACCORDION */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full flex justify-between items-center px-4 py-3 bg-linear-to-r from-gray-50 to-gray-100 font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Category</span>
                <span className="font-semibold text-gray-800">
                  {assetCategory || "Select Asset Category"}
                </span>
              </span>

              <span className="text-gray-500 text-sm">
                {accordionOpen ? "▲" : "▼"}
              </span>
            </button>

            {accordionOpen && (
              <div className="bg-white divide-y">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setAssetCategory(cat);
                      setAccordionOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition
            ${
              assetCategory === cat
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }
          `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* REASON */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Reason (optional)</label>
            <textarea
              placeholder="Explain briefly why you need this asset..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Submit Request
          </button>
        </form>
      </div>

     

      {/* REQUESTS TABLE */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">My Requests</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned Asset</th>
              <th className="p-3">Requested On</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No requests submitted yet
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.assetCategory}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>

                    {req.status === "rejected" && req.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="p-3">{req.assignedAsset?.name || "-"}</td>

                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedAsset && (
  <ReportIssueModal
    asset={selectedAsset}
    onClose={() => setSelectedAsset(null)}
    onSuccess={handleIssueReported}
  />
)}

    </div>
  );
};

export default EmployeeDashboard;
