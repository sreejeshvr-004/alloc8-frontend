const ReportPreviewModal = ({
  title,
  open,
  onClose,
  onExportPdf,
  onExportExcel,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-6xl h-[85vh] rounded-xl shadow-lg flex flex-col">
        
        {/* HEADER (sticky) */}
        <div className="flex justify-between items-center px-5 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>

          <div className="flex items-center gap-3">
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              >
                Export PDF
              </button>
            )}

            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              >
                Export Excel
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY (scrollable) */}
        <div className="p-5 overflow-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
