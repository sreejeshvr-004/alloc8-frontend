import { useEffect, useState } from "react";
import api from "../api/axios";

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    const res = await api.get("/requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(
      `/requests/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchRequests();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full">
      <h3 className="text-lg font-semibold mb-4">Requests</h3>

      <div className="overflow-y-auto max-h-100">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-2 w-1/4 text-left">Employee</th>
              <th className="p-2 w-1/4 text-left">Category</th>
              <th className="p-2 w-1/4 text-left">Status</th>
              <th className="p-2 w-1/4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-2 wrap-break-words">
                  {req.user?.name}
                </td>

                <td className="p-2">{req.assetCategory}</td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="p-2 space-y-1">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(req._id, "approved")
                        }
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded w-full hover:bg-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(req._id, "rejected")
                        }
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded w-full hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">
                      No actions
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTable;