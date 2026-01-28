import { useState } from "react";
import { SlidersHorizontal, AlertCircle, RotateCcw } from "lucide-react";

const AssetTableToolbar = ({ filter, setFilter, issueCount, returnCount }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Assets</h3>

      <div className="flex items-center gap-3 relative">
        {/* RETURN ICON */}
        <button
          title={
            returnCount > 0 ? "Asset Return Requests" : "No Return Requests"
          }
          onClick={() => {
            if (returnCount > 0) {
              setFilter("return");
            }
          }}
          className="relative p-2 rounded-lg transition hover:bg-gray-100"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />

          {returnCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 text-[11px]
      bg-blue-600 text-white rounded-full flex items-center justify-center"
            >
              {returnCount}
            </span>
          )}
        </button>

        {/* ISSUE ICON */}
        <button
          title={issueCount > 0 ? "Reported Issues" : "No Issues Reported"}
          onClick={() => {
            if (issueCount > 0) {
              setFilter("issue");
            }
          }}
          className="relative p-2 rounded-lg transition hover:bg-gray-100"
        >
          <AlertCircle className="w-5 h-5 text-gray-700" />

          {issueCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 text-[11px]
      bg-red-600 text-white rounded-full flex items-center justify-center"
            >
              {issueCount}
            </span>
          )}
        </button>

        {/* SORT ICON */}
        <button
          title="Filter Assets"
          onClick={() => setShowFilterMenu((v) => !v)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
        </button>

        {/* DROPDOWN */}
        {showFilterMenu && (
          <div className="absolute right-0 top-10 w-44 bg-white border rounded-lg shadow-md z-10">
            {[
              { key: "all", label: "All Assets" },
              { key: "active", label: "Active Assets" },
              { key: "available", label: "Available Assets" },
              { key: "inactive", label: "Inactive Assets" },
              { key: "issue", label: "Issue Reported" },
              { key: "return", label: "Return Requested" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setFilter(item.key);
                  setShowFilterMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  filter === item.key ? "font-semibold text-indigo-600" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetTableToolbar;
