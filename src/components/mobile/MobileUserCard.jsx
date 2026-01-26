const MobileUserCard = ({ user, onEdit, onDisable, onRestore, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p
            className="font-semibold text-sm text-blue-600 cursor-pointer"
            onClick={() => onView(user._id)}
          >
            {user.name}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Dept: {user.department || "-"}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            user.isDeleted
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user.isDeleted ? "Inactive" : "Active"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => onEdit(user)}
          className="bg-indigo-500 text-white text-xs py-2 rounded"
        >
          Edit
        </button>

        {!user.isDeleted ? (
          <button
            onClick={() => onDisable(user._id)}
            className="bg-red-500 text-white text-xs py-2 rounded"
          >
            Disable
          </button>
        ) : (
          <button
            onClick={() => onRestore(user._id)}
            className="bg-green-500 text-white text-xs py-2 rounded"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileUserCard;
