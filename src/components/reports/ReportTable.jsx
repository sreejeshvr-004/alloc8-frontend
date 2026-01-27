import { ArrowUp, ArrowDown } from "lucide-react";

const ReportTable = ({
  columns,
  rows,
  sortConfig,
  setSortConfig,
}) => {
  const handleSort = (index) => {
    setSortConfig((prev) => {
      if (prev.columnIndex === index) {
        return {
          columnIndex: index,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { columnIndex: index, direction: "asc" };
    });
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={col}
                onClick={() => handleSort(i)}
                className="px-4 py-2 text-left font-semibold text-gray-600 cursor-pointer select-none"
              >
                <div className="flex items-center gap-1">
                  {col}
                  {sortConfig.columnIndex === i &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-t">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
