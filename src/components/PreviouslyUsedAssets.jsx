const PreviouslyUsedAssets = ({ assets }) => {
  const previousAssets =
    assets?.filter(
      (asset) =>
        asset.status === "maintenance" ||
        asset.status === "replaced" ||
        asset.status === "available"
    ) || [];

  if (previousAssets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 border border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🕘</div>
          <p className="text-sm">
            No previously used assets yet.
          </p>
        </div>
      </div>
    );
  }

  return (
   <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">

      <h3 className="text-lg font-semibold mb-4">
        Previously Used Assets
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {previousAssets.map((asset) => (
          <div
            key={asset._id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <h4 className="font-semibold text-gray-800">
              {asset.name}
            </h4>

            <p className="text-sm text-gray-600">
              Category: {asset.category}
            </p>

            <p className="text-sm text-gray-600">
              Serial: {asset.serialNumber || "N/A"}
            </p>

            <p className="text-sm text-gray-600">
              Final Status:{" "}
              <span className="capitalize font-medium">
                {asset.status === "maintenance"
                  ? "Sent to Maintenance"
                  : asset.status === "replaced"
                  ? "Replaced"
                  : "Returned"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviouslyUsedAssets;
