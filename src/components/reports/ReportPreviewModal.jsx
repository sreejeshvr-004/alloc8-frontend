import { useMemo, useState } from "react";
import ReportFilters from "./ReportFilters";
import ReportTable from "./ReportTable";

const ReportPreviewModal = ({
  title,
  open,
  onClose,
  onExportPdf,
  onExportExcel,
  columns = [],
  rows = [],
}) => {
  if (!open) return null;

  const safeRows = Array.isArray(rows) ? rows : [];

  // FILTER STATE
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    department: "",
    dateColumn: "",
    fromDate: "",
    toDate: "",
  });

  // SORT STATE
  const [sortConfig, setSortConfig] = useState({
    columnIndex: null,
    direction: "asc", // asc | desc
  });

  // FILTER + SORT LOGIC (single source of truth)
  const processedRows = useMemo(() => {
    let data = [...safeRows];

    // 1️⃣ Global search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((row) =>
        row.some((cell) => String(cell).toLowerCase().includes(q)),
      );
    }

    // Helper for column filters
    const applyColumnFilter = (columnName, value) => {
      if (!value) return;
      const index = columns.findIndex((c) => c.toLowerCase() === columnName);
      if (index === -1) return;
      data = data.filter((row) => row[index] === value);
    };

    applyColumnFilter("status", filters.status);
    applyColumnFilter("category", filters.category);
    applyColumnFilter("department", filters.department);

    // 2️⃣ Sorting
    if (sortConfig.columnIndex !== null) {
      const { columnIndex, direction } = sortConfig;

      data.sort((a, b) => {
        const A = a[columnIndex];
        const B = b[columnIndex];

        // Date
        if (!isNaN(Date.parse(A)) && !isNaN(Date.parse(B))) {
          return direction === "asc"
            ? new Date(A) - new Date(B)
            : new Date(B) - new Date(A);
        }

        // Number
        if (!isNaN(A) && !isNaN(B)) {
          return direction === "asc" ? A - B : B - A;
        }

        // String
        return direction === "asc"
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
    }
    // 2️⃣ Date range filter
    if (filters.dateColumn && (filters.fromDate || filters.toDate)) {
      const colIndex = columns.findIndex(
        (c) => c.toLowerCase() === filters.dateColumn.toLowerCase(),
      );

      if (colIndex !== -1) {
        const from = filters.fromDate ? new Date(filters.fromDate) : null;
        const to = filters.toDate ? new Date(filters.toDate) : null;

        data = data.filter((row) => {
          const cellDate = new Date(row[colIndex]);
          if (isNaN(cellDate)) return false;

          if (from && cellDate < from) return false;
          if (to && cellDate > to) return false;

          return true;
        });
      }
    }

    return data;
  }, [rows, filters, sortConfig, columns]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-6xl h-[85vh] rounded-xl shadow-lg flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>

          <div className="flex gap-2">
            {onExportPdf && (
              <button
                onClick={() =>
                  onExportPdf?.({
                    title,
                    columns,
                    rows: processedRows,
                  })
                }
                className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              >
                Export PDF
              </button>
            )}
            {onExportExcel && (
              <button
                onClick={() =>
                  onExportExcel?.({
                    title,
                    columns,
                    rows: processedRows,
                  })
                }
                className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              >
                Export Excel
              </button>
            )}
            <button onClick={onClose} className="text-xl">
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-auto flex-1">
          <ReportFilters
            columns={columns}
            rows={rows}
            filters={filters}
            setFilters={setFilters}
          />

          <ReportTable
            columns={columns}
            rows={processedRows}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
