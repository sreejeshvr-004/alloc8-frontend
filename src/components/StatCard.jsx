const StatCard = ({ title, value, icon }) => {
  return (
    <div
      className="
        bg-white
        p-3 md:p-5
        rounded-xl
        shadow
        flex items-center justify-between
      "
    >
      <div>
        <p className="text-xs md:text-sm text-gray-500">
          {title}
        </p>

        <p className="text-xl md:text-3xl font-bold leading-tight mt-1 md:mt-2">
          {value !== undefined && value !== null ? value : "—"}
        </p>
      </div>

      {/* Icon: desktop only */}
      {icon && (
        <div className="hidden md:block text-3xl text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
