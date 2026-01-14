const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <p className="text-3xl font-bold mt-2">
          {value !== undefined && value !== null ? value : "—"}
        </p>
      </div>

      {icon && <div className="text-3xl text-gray-400">{icon}</div>}
    </div>
  );
};

export default StatCard;
