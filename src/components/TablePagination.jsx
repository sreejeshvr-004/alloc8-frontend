const TablePagination = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
}) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  const start = page * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, total);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t bg-white text-sm">
      {/* ROWS PER PAGE */}
      <div className="flex items-center gap-2">
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={15}>15 rows</option>
          <option value={20}>20 rows</option>
          <option value={25}>25 rows</option>
        </select>
      </div>

      {/* RANGE */}
      <div className="text-gray-600">
        {start}-{end} of {total}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(0)}
          disabled={page === 0}
          className="px-2 disabled:opacity-40"
        >
          «
        </button>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-2 disabled:opacity-40"
        >
          ‹
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-2 disabled:opacity-40"
        >
          ›
        </button>
        <button
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="px-2 disabled:opacity-40"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
