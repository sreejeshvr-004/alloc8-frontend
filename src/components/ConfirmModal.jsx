const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmBtnClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-yellow-600 hover:bg-yellow-700";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`${confirmBtnClass} text-white px-4 py-1 rounded`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
