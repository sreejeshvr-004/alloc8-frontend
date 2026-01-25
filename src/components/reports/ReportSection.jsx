const ReportSection = ({ title, description, children, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {children}
    </div>
  );
};

export default ReportSection;
