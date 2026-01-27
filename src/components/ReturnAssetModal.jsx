const ReturnAssetModal = ({ asset, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 py-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md p-5">
        {/* HEADER */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Return Asset
        </h3>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to return this asset?
          <br />
          Once returned, you will no longer be responsible for it.
        </p>

        {/* ASSET INFO */}
        <div className="border rounded-md p-3 bg-gray-50 mb-4">
          <p className="text-sm font-medium text-gray-800">{asset.name}</p>
          <p className="text-xs text-gray-600">Category: {asset.category}</p>
          <p className="text-xs text-gray-600">Serial: {asset.serialNumber}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Returning..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnAssetModal;
