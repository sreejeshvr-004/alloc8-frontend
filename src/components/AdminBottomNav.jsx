import { NavLink } from "react-router-dom";
import { adminNavItems } from "./adminNavItems";

const NAV_HEIGHT = "h-16"; // 64px

const AdminBottomNav = ({ pendingCount = 0 }) => {
  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0
        ${NAV_HEIGHT}
        bg-white
        border-t border-gray-200
        flex justify-around items-center
        md:hidden
        z-50
        px-2
        pb-safe
      `}
    >
      {adminNavItems.map(({ to, icon: Icon, label, end }) => {
        const isRequests = to === "/admin/requests";

        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center
               gap-0.5 text-[11px] leading-tight
               ${
                 isActive
                   ? "text-indigo-600"
                   : "text-gray-500"
               }`
            }
          >
            <Icon size={20} />
            <span className="truncate">{label}</span>

            {isRequests && pendingCount > 0 && (
              <span
                className="
                  absolute -top-1 right-3
                  bg-red-600 text-white
                  text-[10px] font-semibold
                  rounded-full px-1.5 py-0.5
                  leading-none
                "
              >
                {pendingCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminBottomNav;
