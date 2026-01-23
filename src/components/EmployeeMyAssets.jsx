const EmployeeMyAssets = ({ assets, onReport }) => {
  const assignedAssets =
    assets?.filter((asset) => asset.status === "assigned") || [];

  if (assignedAssets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 border border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-3">📦</div>

          <h3 className="text-lg font-semibold text-gray-700">
            No Assets Assigned
          </h3>

          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            You currently don't have any assets assigned to you.
            If you need an asset, please submit a request above or wait for admin allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">My Assets</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignedAssets.map((asset) => (
          <div
            key={asset._id}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <h4 className="font-semibold text-gray-800">{asset.name}</h4>

            <p className="text-sm text-gray-600">
              Category: {asset.category}
            </p>

            <p className="text-sm text-gray-600">
              Serial: {asset.serialNumber}
            </p>

            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="font-medium capitalize">
                {asset.status}
              </span>
            </p>

            <button
              onClick={() => onReport(asset)}
              className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Report Issue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMyAssets;
