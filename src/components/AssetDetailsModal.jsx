import { downloadPdf } from "../utils/downloadPdf";

const AssetDetailsModal = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Asset Details — {asset.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <p><strong>Category:</strong> {asset.category}</p>
          <p><strong>Serial:</strong> {asset.serialNumber}</p>
          <p><strong>Cost:</strong> ₹{asset.assetCost || "-"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-xs ${
                asset.status === "available"
                  ? "bg-green-100 text-green-700"
                  : asset.status === "inactive"
                  ? "bg-gray-200 text-gray-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {asset.status}
            </span>
          </p>

          <p>
            <strong>Purchase Date:</strong>{" "}
            {asset.purchaseDate
              ? new Date(asset.purchaseDate).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <strong>Warranty Expiry:</strong>{" "}
            {asset.warrantyExpiry
              ? new Date(asset.warrantyExpiry).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <strong>Assigned To:</strong>{" "}
            {asset.assignedTo?.name || "-"}
          </p>

          <p>
            <strong>Maintenance Count:</strong>{" "}
            {asset.maintenanceCount ?? 0}
          </p>

          <p>
            <strong>Total Maintenance Cost:</strong>{" "}
            ₹{asset.totalMaintenanceCost ?? 0}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() =>
              downloadPdf(
                `/assets/${asset._id}/history/pdf`,
                `${asset.name}-history.pdf`
              )
            }
            className="bg-teal-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-600"
          >
            Download History PDF
          </button>

          <button
            onClick={() =>
              downloadPdf(
                `/assets/${asset._id}/full-report/pdf`,
                `${asset.name}-full-report.pdf`
              )
            }
            className="bg-teal-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-600"
          >
            Full Asset Report
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
