import { assetImageUrl } from "../utils/assetImage";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "-";

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

  const badge = (status) =>
    status === "issue"
      ? "bg-red-100 text-red-700"
      : status === "maintenance"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const label = (status) =>
    status === "issue"
      ? "Issue Reported"
      : status === "maintenance"
      ? "Maintenance"
      : "Returned";

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Previously Used Assets</h3>
        <button className="text-sm px-4 py-1.5 rounded-full border hover:bg-gray-100">
          View all
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {assets.map((asset) => (
          <div
            key={`${asset.assetId}-${asset.assignedAt}`}
            className="min-w-65 bg-gray-50 rounded-lg border hover:shadow transition"
          >
            <img
              src={
                asset.image
                  ? assetImageUrl(asset.image)
                  : "/assets/device.png"
              }
              onError={(e) =>
                (e.currentTarget.src = "/assets/device.png")
              }
              className="w-full h-24 object-cover rounded-t-lg"
              alt={asset.name}
            />

            <div className="p-2 space-y-0.5 text-sm">
              <p className="font-semibold">{asset.name}</p>
              <p>Category: {asset.category}</p>
              <p>Serial: {asset.serialNumber}</p>
              <p>Assigned: {formatDate(asset.assignedAt)}</p>
              <p>Returned: {formatDate(asset.unassignedAt)}</p>
              <p>Duration: {asset.durationDays} day(s)</p>

              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${badge(
                  asset.finalStatus
                )}`}
              >
                {label(asset.finalStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviouslyUsedAssets;
