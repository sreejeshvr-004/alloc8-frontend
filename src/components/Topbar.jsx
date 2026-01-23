import { useAuth } from "../auth/AuthContext";

const AdminTopbar = ({ title, actions }) => {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {actions}

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg text-sm font-medium 
                     bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;
