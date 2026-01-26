const Spinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div
        className="
          w-8 h-8
          border-4 border-gray-200
          border-t-indigo-600
          rounded-full
          animate-spin
        "
      />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default Spinner;
