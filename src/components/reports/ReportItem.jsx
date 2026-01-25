import { FileText } from "lucide-react";

const ReportItem = ({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-500">
          {icon || <FileText size={18} />}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>

      {/* <span className="text-sm text-blue-600 hover:underline">
        View
      </span> */}  
    </div>
  );
};

export default ReportItem;
