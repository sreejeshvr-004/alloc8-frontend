import { assetImageUrl } from "../utils/assetImage";

const PreviouslyUsedAssets = ({ assets = [] }) => {
  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 border border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🕘</div>
          <p className="text-sm">No previously used assets yet.</p>
        </div>
      </div>
    );
  }

  const statusBadge = (status) => {
    if (status === "issue") return "bg-red-100 text-red-700";
    if (status === "maintenance") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const statusText = (status) => {
    if (status === "issue") return "Issue Reported";
    if (status === "maintenance") return "Maintenance";
    return "Returned";
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Previously Used Assets</h3>
        <button className="text-sm px-4 py-1.5 rounded-full border hover:bg-gray-100">
          View all
        </button>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {assets.map((asset) => (
          <div
            key={asset.assetId}
            className="min-w-[280px] bg-gray-50 rounded-lg border hover:shadow transition flex flex-col">
            {/* IMAGE */}
            <img
              src={
                asset.image ? assetImageUrl(asset.image) : "/assets/device.png"
              }
              alt={asset.name}
              className="w-full h-28 object-cover rounded-t-lg"
            />

            {/* CONTENT */}
            <div className="p-3 space-y-1">
              <h4 className="font-semibold text-gray-800">{asset.name}</h4>

              <p className="text-sm text-gray-600">
                Category: {asset.category}
              </p>

              <p className="text-sm text-gray-600">
                Serial: {asset.serialNumber}
              </p>

              <p className="text-sm text-gray-600">
                Assigned on:{" "}
                <span className="font-medium">
                  {asset.assignedAt
                    ? new Date(asset.assignedAt).toLocaleDateString()
                    : "-"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Returned on:{" "}
                <span className="font-medium">
                  {asset.unassignedAt
                    ? new Date(asset.unassignedAt).toLocaleDateString()
                    : "-"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Duration used:{" "}
                <span className="font-medium">
                  {asset.durationDays} day
                  {asset.durationDays > 1 ? "s" : ""}
                </span>
              </p>

              <span
                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${statusBadge(
                  asset.finalStatus,
                )}`}
              >
                {statusText(asset.finalStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviouslyUsedAssets;
