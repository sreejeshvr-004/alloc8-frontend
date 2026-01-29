import { assetImageUrl } from "../utils/assetImage";

const EmployeeMyAssets = ({ assets = [], onReport, onReturn }) => {
  if (!Array.isArray(assets)) {
    console.error("EmployeeMyAssets received non-array:", assets);
    assets = []; // safe fallback
  }

  const assignedAssets = assets.filter(
    (asset) =>
      asset.status === "assigned" ||
      asset.status === "issue_reported" ||
      asset.status === "return_requested"
  );

  if (assignedAssets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 border border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-3">📦</div>
          <h3 className="text-lg font-semibold text-gray-700">
            No Assets Assigned
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto px-2">
            You currently don't have any assets assigned to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">My Assets</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assignedAssets.map((asset) => {
          const isIssueReported = asset.status === "issue_reported";
          const isReturnRequested = asset.status === "return_requested";
          return (
            <div
              key={asset._id}
              className="border rounded-lg p-4 flex gap-4 hover:shadow transition"
            >
              {/* IMAGE */}
              <img
                src={
                  asset.images?.[0]
                    ? assetImageUrl(asset.images[0])
                    : "/assets/device.png"
                }
                alt={asset.name}
                className="w-20 h-20 object-cover rounded-md border bg-white"
              />

              {/* CONTENT */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {asset.name}
                  </h4>

                  <p className="text-sm text-gray-600">
                    Category: {asset.category}
                  </p>

                  <p className="text-sm text-gray-600">
                    Serial: {asset.serialNumber}
                  </p>

                  {/* STATUS */}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        isIssueReported
                          ? "bg-orange-100 text-orange-700"
                          : isReturnRequested
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isIssueReported
                        ? "Issue Reported"
                        : isReturnRequested
                        ? "Return Requested"
                        : "Assigned"}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onReport(asset)}
                    disabled={isIssueReported || isReturnRequested}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                      isIssueReported || isReturnRequested
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    Report Issue
                  </button>

                  <button
                    onClick={() => onReturn?.(asset)}
                    disabled={isIssueReported || isReturnRequested}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                      isIssueReported || isReturnRequested
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isReturnRequested ? "Return Requested" : "Return Asset"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeMyAssets;
