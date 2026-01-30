import { useState } from "react";

const statusStyles = {
  available: "bg-green-100 text-green-700",
  assigned: "bg-blue-100 text-blue-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  inactive: "bg-gray-200 text-gray-600",
};

const MobileAssetRow = ({
  asset,
  employees = [],
  onAssign,
  onUnassign,
  onSendToMaintenance,
  onViewHistory,
  onCompleteMaintenance,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const activeEmployees = employees.filter((e) => e.isDeleted !== true);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* HEADER ROW */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="font-semibold text-sm">{asset.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {asset.category} • {asset.serialNumber}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded capitalize ${
            statusStyles[asset.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {asset.status}
        </span>
      </div>

      {/* PRIMARY ACTIONS */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {asset.status === "assigned" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnassign(asset);
            }}
            className="flex-1 bg-gray-600 text-white text-xs py-2 rounded"
          >
            Unassign
          </button>
        )}

        {asset.status === "available" && (
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full border rounded text-xs px-2 py-2"
          >
            <option value="">Select employee</option>

            {activeEmployees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        )}

        {asset.status === "available" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(asset, selectedEmployee);
            }}
            disabled={!selectedEmployee}
            className="
      bg-blue-600 text-white text-xs py-2 rounded
      disabled:opacity-50 disabled:cursor-not-allowed
    "
          >
            Assign
          </button>
        )}

        {asset.status !== "inactive" && asset.status !== "maintenance" && (
          <button
            onClick={onSendToMaintenance}
            className="bg-yellow-500 text-white text-xs py-2 rounded"
          >
            Maintenance
          </button>
        )}
        {asset.status === "maintenance" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompleteMaintenance(asset);
            }}
            className="bg-green-600 text-white text-xs py-2 rounded col-span-2"
          >
            Maintenance Completed
          </button>
        )}
      </div>

      {/* EXPANDABLE DETAILS */}
      {open && (
        <div className="mt-4 pt-3 border-t text-xs text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Cost:</span> ₹
            {asset.assetCost?.toLocaleString() || 0}
          </p>

          <p>
            <span className="font-medium">Warranty:</span>{" "}
            {asset.warrantyExpiry
              ? new Date(asset.warrantyExpiry).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <span className="font-medium">Assigned To:</span>{" "}
            {asset.assignedTo?.name || "-"}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewHistory(asset);
            }}
            className="mt-2 w-full bg-gray-700 text-white py-2 rounded text-xs"
          >
            View History
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileAssetRow;
