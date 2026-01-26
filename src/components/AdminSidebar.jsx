import { NavLink } from "react-router-dom";
import { adminNavItems } from "./adminNavItems";

const AdminSidebar = ({ pendingCount = 0 }) => {
  return (
    <aside
      className="
        hidden md:flex
        fixed left-0 top-0 h-full w-16
        bg-white/90 backdrop-blur-sm
        border-r border-gray-200
        shadow-[2px_0_8px_rgba(0,0,0,0.05)]
        flex-col items-center py-4
      "
    >
      {/* NAV */}
      <nav className="flex flex-col gap-4 mt-4">
        {adminNavItems.map(({ to, icon: Icon, label, end }) => {
          const isRequests = to === "/admin/requests";

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />

              {isRequests && pendingCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    bg-red-600 text-white
                    text-[10px] font-semibold
                    rounded-full px-1.5 py-0.5
                  "
                >
                  {pendingCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
