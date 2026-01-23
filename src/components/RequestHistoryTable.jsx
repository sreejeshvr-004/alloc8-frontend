import { useState } from "react";
import TablePagination from "./TablePagination";

const RequestHistoryTable = ({ requests }) => {
  const history = requests.filter((r) => r.status !== "pending");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedHistory = history.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-md font-semibold mb-4">Request History</h3>

      {/* TABLE */}
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-3 text-left">Requested By</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Asset</th>
              <th className="p-3 text-left">Requested Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">Decision Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            ) : (
              paginatedHistory.map((req) => (
                <tr key={req._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.user?.name}</td>
                  <td className="p-3">{req.assetCategory}</td>
                  <td className="p-3">
                    {req.asset?.serialNumber || "-"}
                  </td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    {req.status === "approved"
                      ? "Approved by admin"
                      : req.rejectionReason}
                  </td>
                  <td className="p-3 text-xs">
                    {new Date(req.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (FIXED FOOTER) */}
      <TablePagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={history.length}
      />
    </div>
  );
};

export default RequestHistoryTable;
