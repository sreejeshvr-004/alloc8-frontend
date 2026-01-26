import {
  Home,
  ClipboardList,
  MonitorSmartphone,
  Users,
  FileText,
} from "lucide-react";

export const adminNavItems = [
  { to: "/admin", icon: Home, label: "Dashboard", end: true },
  { to: "/admin/requests", icon: ClipboardList, label: "Requests" },
  { to: "/admin/assets", icon: MonitorSmartphone, label: "Assets" },
  { to: "/admin/users", icon: Users, label: "Employee" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
];
