import { useEffect, useState } from "react";
import api from "../api/axios";
import { downloadPdf } from "../utils/downloadPdf";
import { downloadUserFullReport } from "../utils/downloadPdf";

const EmployeeAssetHistoryModal = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/users/${employeeId}/asset-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployee(res.data.employee || null);
        setAssets(res.data.assets || []);
      } catch (err) {
        console.error("Failed to load employee history", err);
        setError("Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (!employeeId) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[1000px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Employee Asset History</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* LOADING */}
        {loading && <p className="text-center py-10">Loading...</p>}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* CONTENT */}
        {!loading && employee && (
          <>
            {/* EMPLOYEE DETAILS */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">Employee Details</h3>

              <button
                onClick={() =>
                  downloadPdf(
                    `/users/${employeeId}/full-report/pdf`,
                    "employee-full-asset-report.pdf"
                  )
                }
                className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
              >
                Download User Report
              </button>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {employee.name}
                </p>
                <p>
                  <strong>Email:</strong> {employee.email}
                </p>
                <p>
                  <strong>Department:</strong> {employee.department || "-"}
                </p>
                <p>
                  <strong>Phone:</strong> {employee.phone || "-"}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{employee.salary || "-"}
                </p>

                <p>
                  <strong>Joining Date:</strong>{" "}
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      employee.isDeleted
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {employee.isDeleted ? "Inactive" : "Active"}
                  </span>
                </p>

                {employee.isDeleted && employee.deletedAt && (
                  <p>
                    <strong>Resigned On:</strong>{" "}
                    {new Date(employee.deletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* ASSET USAGE */}
            <div>
              <h3 className="font-semibold mb-3">Asset Usage Timeline</h3>

              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-left">Asset</th>
                    <th className="p-2 text-left">Serial</th>
                    <th className="p-2 text-left">From</th>
                    <th className="p-2 text-left">To</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No asset usage history
                      </td>
                    </tr>
                  ) : (
                    assets.map((a, i) => (
                      <tr
                        key={i}
                        className={`border-t ${
                          a.to === null ? "bg-green-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2">{a.assetName}</td>
                        <td className="p-2">{a.serial}</td>
                        <td className="p-2">
                          {new Date(a.from).toLocaleString()}
                        </td>
                        <td className="p-2">
                          {a.to ? new Date(a.to).toLocaleString() : "Present"}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              a.to === null
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {a.to === null ? "Active" : "Returned"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeAssetHistoryModal;
