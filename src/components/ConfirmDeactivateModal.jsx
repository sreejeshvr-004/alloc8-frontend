const ConfirmDeactivateModal = ({ asset, onConfirm, onClose }) => {
  if (!asset) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-112.5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3 text-red-600">
          Deactivate Asset
        </h3>

        <p className="text-sm text-gray-700 mb-4">
          You are about to deactivate <strong>{asset.name}</strong>.
        </p>

        <ul className="text-sm text-gray-600 list-disc pl-5 mb-4">
          <li>The asset will be marked as <strong>inactive</strong></li>
          <li>Inactive assets cannot be assigned again</li>
          <li>This action <strong>cannot be undone</strong></li>
        </ul>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Deactivate Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeactivateModal;
