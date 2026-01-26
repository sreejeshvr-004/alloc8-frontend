import { useState } from "react";

const statusStyles = {
  available: "bg-green-100 text-green-700",
  assigned: "bg-blue-100 text-blue-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  inactive: "bg-gray-200 text-gray-600",
};

const MobileAssetCard = ({ asset, onView, onRemove }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow p-4 ${
        asset.status === "inactive" ? "opacity-60" : ""
      }`}
    >
      {/* HEADER */}
      <div
        className="flex justify-between items-start"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="font-semibold text-sm">{asset.name}</p>
          <p className="text-xs text-gray-500">
            {asset.category} • {asset.serialNumber || "-"}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded capitalize ${
            statusStyles[asset.status]
          }`}
        >
          {asset.status}
        </span>
      </div>

      {/* EXPANDED DETAILS */}
      {open && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-600 space-y-1">
          <p>
            <b>Cost:</b> ₹{asset.assetCost || 0}
          </p>
          <p>
            <b>Warranty:</b>{" "}
            {asset.warrantyExpiry
              ? new Date(asset.warrantyExpiry).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <b>Assigned:</b> {asset.assignedTo?.name || "-"}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(asset);
              }}
              className="bg-blue-600 text-white text-xs py-2 rounded"
            >
              View
            </button>

            <button
              disabled={asset.status === "inactive"}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(asset);
              }}
              className={`text-xs py-2 rounded ${
                asset.status === "inactive"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 text-white"
              }`}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAssetCard;
