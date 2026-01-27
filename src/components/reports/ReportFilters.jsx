import { Search, Filter, Calendar, X } from "lucide-react";
import { useMemo } from "react";

const ReportFilters = ({ columns = [], rows = [], filters, setFilters }) => {
  // Detect filterable columns by name
  const columnIndexMap = useMemo(() => {
    const map = {};
    columns.forEach((col, index) => {
      map[col.toLowerCase()] = index;
    });
    return map;
  }, [columns]);

  // Get unique values for dropdown filters
  const getUniqueValues = (columnName) => {
    const index = columnIndexMap[columnName];
    if (index === undefined) return [];

    return Array.from(new Set(rows.map((row) => row[index]).filter(Boolean)));
  };

  const statusOptions = getUniqueValues("status");
  const categoryOptions = getUniqueValues("category");
  const departmentOptions = getUniqueValues("department");
  const dateColumns = columns.filter(
    (c) =>
      c.toLowerCase().includes("date") || c.toLowerCase().includes("expiry"),
  );

  return (
    <div className="mb-4 bg-gray-50 border rounded-lg p-4 space-y-4">
      {/* TOP ROW */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* SEARCH */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search anything..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        {/* STATUS FILTER */}
        {statusOptions.length > 0 && (
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="text-sm border rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}

        {/* CATEGORY FILTER */}
        {categoryOptions.length > 0 && (
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
            className="text-sm border rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* DEPARTMENT FILTER */}
        {departmentOptions.length > 0 && (
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters((f) => ({ ...f, department: e.target.value }))
            }
            className="text-sm border rounded-md px-3 py-2"
          >
            <option value="">All Departments</option>
            {departmentOptions.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        )}

        {/* CLEAR */}
        {(filters.search ||
          filters.status ||
          filters.category ||
          filters.department ||
          filters.dateColumn ||
          filters.fromDate ||
          filters.toDate) && (
          <button
            onClick={() =>
              setFilters({
                search: "",
                status: "",
                category: "",
                department: "",
                dateColumn: "",
                fromDate: "",
                toDate: "",
              })
            }
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
      {dateColumns.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* DATE COLUMN */}
          <select
            value={filters.dateColumn || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dateColumn: e.target.value }))
            }
            className="text-sm border rounded-md px-3 py-2"
          >
            <option value="">Date column</option>
            {dateColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          {/* FROM DATE */}
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fromDate: e.target.value }))
              }
              className="text-sm border rounded-md px-3 py-2"
            />
          </div>

          {/* TO DATE */}
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, toDate: e.target.value }))
              }
              className="text-sm border rounded-md px-3 py-2"
            />
          </div>

          {/* CLEAR DATE */}
          {(filters.fromDate || filters.toDate) && (
            <button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  dateColumn: "",
                  fromDate: "",
                  toDate: "",
                }))
              }
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
            >
              <X size={14} />
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* INFO */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Filter size={14} />
        Filters apply instantly. Export will match the visible table.
      </div>
    </div>
  );
};

export default ReportFilters;
