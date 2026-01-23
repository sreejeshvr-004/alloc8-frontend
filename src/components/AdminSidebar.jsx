import { NavLink } from "react-router-dom";
import {
  Home,
  ClipboardList,
  MonitorSmartphone,
  Users,
  FileText,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: Home, label: "Dashboard", end: true },
  { to: "/admin/requests", icon: ClipboardList, label: "Requests" },
  { to: "/admin/assets", icon: MonitorSmartphone, label: "Assets Creation" },
  { to: "/admin/users", icon: Users, label: "User management" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
];

const AdminSidebar = ({ pendingCount = 0 }) => {
  return (
    <aside className="
      fixed left-0 top-0 h-full w-16
      bg-white/90 backdrop-blur-sm
      border-r border-gray-200
      shadow-[2px_0_8px_rgba(0,0,0,0.05)]
      flex flex-col items-center py-4
    ">
      {/* LOGO */}
      <div className="text-xl font-bold text-indigo-600 mb-4">A8</div>

      {/* NAV */}
      <nav className="flex flex-col gap-4">
        {navItems.map(({ to, icon: Icon, label, end }) => {
          const isRequests = to === "/admin/requests"; // ✅ FIX

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

              {/* 🔴 Pending Requests Badge */}
              {isRequests && pendingCount > 0 && (
                <span className="
                  absolute -top-1 -right-1
                  bg-red-600 text-white
                  text-[10px] font-semibold
                  rounded-full px-1.5 py-0.5
                  min-w-[16px] text-center
                ">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* PROFILE */}
      <div className="mt-auto">
        <div className="
          w-10 h-10 rounded-full
          bg-indigo-100 text-indigo-600
          flex items-center justify-center
          font-semibold cursor-pointer
        ">
          A
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
