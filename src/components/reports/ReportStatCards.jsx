import StatCard from "../StatCard";
import {
  Package,
  UserCheck,
  Warehouse,
  Wrench,
  CalendarClock,
  ClipboardCheck,
} from "lucide-react";

const ReportStatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <StatCard title="Total Assets" value={stats.totalAssets} icon={<Package />} />
      <StatCard title="Assets Assigned" value={stats.assigned} icon={<UserCheck />} />
      <StatCard title="Unassigned / In Stock" value={stats.unassigned} icon={<Warehouse />} />
      <StatCard title="Under Repair" value={stats.maintenance} icon={<Wrench />} />
      <StatCard title="Expiring Warranties" value={stats.expiring} icon={<CalendarClock />} />
      <StatCard title="Pending Verification" value={stats.pending} icon={<ClipboardCheck />} />
    </div>
  );
};

export default ReportStatCards;
