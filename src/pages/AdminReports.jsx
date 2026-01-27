import api from "../api/axios";
import { useEffect, useState } from "react";

import ReportStatCards from "../components/reports/ReportStatCards";
import ReportSection from "../components/reports/ReportSection";
import ReportItem from "../components/reports/ReportItem";
import {
  Boxes,
  Tag,
  MapPin,
  Activity,
  ShieldCheck,
  FileSearch,
  DollarSign,
  TrendingDown,
  BookOpen,
  Wrench,
  CalendarClock,
  ArrowLeftRight,
  UserSquare,
} from "lucide-react";

import ReportPreviewModal from "../components/reports/ReportPreviewModal";
import ReportTable from "../components/reports/ReportTable";
import { downloadPdf } from "../utils/downloadPdf";
import { downloadExcel } from "../utils/downloadExcel";

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const res = await api.get("/reports/overview");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load report overview", err);
        setStatsError(true);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchOverviewStats();
  }, []);

  const [preview, setPreview] = useState({
    open: false,
    title: "",
    columns: [],
    rows: [],
  });

  const openAssetRegisterPreview = async () => {
    try {
      const res = await api.get("/reports/assets/full");

      setPreview({
        open: true,
        title: "Full Asset Register",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load report");
      console.error(err);
    }
  };
  const openAssetsByCategoryPreview = async () => {
    try {
      const res = await api.get("/reports/assets/by-category");

      setPreview({
        open: true,
        title: "Assets By Category",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load report");
      console.error(err);
    }
  };
  const openAssetsByStatusPreview = async () => {
    try {
      const res = await api.get("/reports/assets/by-status");

      setPreview({
        open: true,
        title: "Assets By Status",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load report");
      console.error(err);
    }
  };

  const openAssetsByLocationPreview = async () => {
    try {
      const res = await api.get("/reports/assets/by-location");

      setPreview({
        open: true,
        title: "Assets By Location",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load report");
      console.error(err);
    }
  };

  const openMaintenanceLogsPreview = async () => {
    try {
      const res = await api.get("/reports/maintenance/logs");

      setPreview({
        open: true,
        title: "Maintenance Logs",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load maintenance logs");
      console.error(err);
    }
  };

  const openWarrantyAMCPreview = async () => {
    try {
      const res = await api.get("/reports/assets/warranty");

      setPreview({
        open: true,
        title: "Warranty / AMC Report",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load warranty report");
      console.error(err);
    }
  };

  const openExpiringWarrantyPreview = async () => {
    const res = await api.get("/reports/assets/warranty/expiring");
    setPreview({
      open: true,
      title: "Warranty Expiring Soon",
      columns: res.data.columns,
      rows: res.data.rows,
    });
  };

  const openAssignmentHistoryPreview = async () => {
    try {
      const res = await api.get("/reports/assignment/history");

      setPreview({
        open: true,
        title: "Assignment History",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load assignment history");
      console.error(err);
    }
  };

  const openTransferReportsPreview = async () => {
    try {
      const res = await api.get("/reports/assignment/transfers");

      setPreview({
        open: true,
        title: "Transfer Reports",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load transfer reports");
      console.error(err);
    }
  };

  const openEmployeeAssetListPreview = async () => {
    try {
      const res = await api.get("/reports/assignment/employee-assets");

      setPreview({
        open: true,
        title: "Employee Asset List",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load employee asset list");
      console.error(err);
    }
  };

  const openPurchaseCostPreview = async () => {
    try {
      const res = await api.get("/reports/financial/purchase-cost");

      setPreview({
        open: true,
        title: "Purchase Cost Report",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load purchase cost report");
      console.error(err);
    }
  };
  const openMaintenanceExpensePreview = async () => {
    try {
      const res = await api.get("/reports/financial/maintenance-expense");

      setPreview({
        open: true,
        title: "Maintenance Expense",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load maintenance expense report");
      console.error(err);
    }
  };
  const openAuditFindingsPreview = async () => {
    try {
      const res = await api.get("/reports/financial/audit-findings");
      setPreview({
        open: true,
        title: "Audit Findings",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load audit findings");
      console.error(err);
    }
  };
  const openWriteOffSummaryPreview = async () => {
    try {
      const res = await api.get("/reports/financial/write-off");
      setPreview({
        open: true,
        title: "Write-off Summary",
        columns: res.data.columns,
        rows: res.data.rows,
      });
    } catch (err) {
      alert("Failed to load Write-off Summary");
      console.error(err);
    }
  };

  const exportAssetRegisterPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAssetRegisterExcel = ({ title, columns, rows }) => {
    downloadExcel("/reports/export/excel", { title, columns, rows });
  };
  const exportAssetsByCategoryPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAssetsByCategoryExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportAssetsByStatusPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAssetsByStatusExcel = ({ title, columns, rows }) => {
    downloadExcel("/reports/export/excel", { title, columns, rows });
  };
  const exportAssetsByLocationPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAssetsByLocationExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportMaintenanceLogsPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportMaintenanceLogsExcel = ({ title, columns, rows }) => {
    downloadExcel("/reports/export/excel", { title, columns, rows });
  };
  const exportWarrantyPDF = ({ title, columns, rows }) => {
    downloadPdf(
      "/reports/export/pdf",
      { title, columns, rows }
    );
  };
  const exportWarrantyExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportWarrantyAMCPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportWarrantyAMCExcel = ({ title, columns, rows }) => {
    downloadExcel("/reports/export/excel",{ title, columns, rows });
  };

  const exportAssignmentHistoryPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAssignmentHistoryExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportTransferReportsPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };

  const exportTransferReportsExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };

  const exportEmployeeAssetListPDF = ({ title, columns, rows }) => {
    downloadPdf(
      "/reports/export/pdf",
      { title, columns, rows }
    );
  };

  const exportEmployeeAssetListExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };

  const exportPurchaseCostReportPDF = ({ title, columns, rows }) => {
    downloadPdf(
      "/reports/export/pdf",
     { title, columns, rows }
    );
  };

  const exportPurchaseCostReportExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportMaintenanceExpensePDF = ({ title, columns, rows }) => {
    downloadPdf(
      "/reports/export/pdf",
      { title, columns, rows }
    );
  };

  const exportMaintenanceExpenseExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
    { title, columns, rows }
    );
  };

  const exportAuditFindingsPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportAuditFindingsExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };
  const exportWriteOffSummaryPDF = ({ title, columns, rows }) => {
    downloadPdf("/reports/export/pdf", { title, columns, rows });
  };
  const exportWriteOffSummaryExcel = ({ title, columns, rows }) => {
    downloadExcel(
      "/reports/export/excel",
      { title, columns, rows }
    );
  };

  const reportExportMap = {
    "Full Asset Register": {
      pdf: exportAssetRegisterPDF,
      excel: exportAssetRegisterExcel,
    },
    "Assets By Category": {
      pdf: exportAssetsByCategoryPDF,
      excel: exportAssetsByCategoryExcel,
    },
    "Assets By Status": {
      pdf: exportAssetsByStatusPDF,
      excel: exportAssetsByStatusExcel,
    },
    "Assets By Location": {
      pdf: exportAssetsByLocationPDF,
      excel: exportAssetsByLocationExcel,
    },
    "Maintenance Logs": {
      pdf: exportMaintenanceLogsPDF,
      excel: exportMaintenanceLogsExcel,
    },
    "Warranty Expiring Soon": {
      pdf: exportWarrantyPDF,
      excel: exportWarrantyExcel,
    },
    "Warranty / AMC Report": {
      pdf: exportWarrantyAMCPDF,
      excel: exportWarrantyAMCExcel,
    },
    "Assignment History": {
      pdf: exportAssignmentHistoryPDF,
      excel: exportAssignmentHistoryExcel,
    },
    "Transfer Reports": {
      pdf: exportTransferReportsPDF,
      excel: exportTransferReportsExcel,
    },
    "Employee Asset List": {
      pdf: exportEmployeeAssetListPDF,
      excel: exportEmployeeAssetListExcel,
    },
    "Purchase Cost Report": {
      pdf: exportPurchaseCostReportPDF,
      excel: exportPurchaseCostReportExcel,
    },
    "Maintenance Expense": {
      pdf: exportMaintenanceExpensePDF,
      excel: exportMaintenanceExpenseExcel,
    },

    "Audit Findings": {
      pdf: exportAuditFindingsPDF,
      excel: exportAuditFindingsExcel,
    },
    "Write-off Summary": {
      pdf: exportWriteOffSummaryPDF,
      excel: exportWriteOffSummaryExcel,
    },
  };

  return (
    <div className="p-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold mb-6">Asset Management Reports</h1>
      {/* OVERVIEW STATS */} {/* TOP STATS */}
      {loadingStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      )}
      {statsError && (
        <div className="mb-6 text-sm text-red-600">
          Failed to load overview statistics.
        </div>
      )}
      {stats && <ReportStatCards stats={stats} />}
      {/* ASSET INVENTORY */}
      <ReportSection
        title="Asset Inventory Reports"
        description="Overview and classification of all company assets"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReportItem
            title="Full Asset Register"
            icon={<Boxes size={18} />}
            onClick={openAssetRegisterPreview}
          />

          <ReportItem
            title="By Category"
            icon={<Tag size={18} />}
            onClick={openAssetsByCategoryPreview}
          />
          <ReportItem
            title="By Status"
            icon={<Activity size={18} />}
            onClick={openAssetsByStatusPreview}
          />
          <ReportItem
            title="By Department"
            icon={<MapPin size={18} />}
            onClick={openAssetsByLocationPreview}
          />
        </div>
      </ReportSection>
      {/* FINANCIAL */}
      <ReportSection
        title="Financial & Audit Reports"
        description="Asset valuation, depreciation and write-offs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReportItem
            title="Purchase Cost Report"
            icon={<DollarSign size={18} />}
            onClick={openPurchaseCostPreview}
          />
          <ReportItem
            title="Maintenance Expense"
            icon={<Wrench size={18} />}
            onClick={openMaintenanceExpensePreview}
          />

          <ReportItem
            title="Audit Findings"
            icon={<FileSearch size={18} />}
            onClick={openAuditFindingsPreview}
          />

          <ReportItem
            title="Write-off Summary"
            icon={<TrendingDown size={18} />}
            onClick={openWriteOffSummaryPreview}
          />
        </div>
      </ReportSection>
      {/* MAINTENANCE */}
      <ReportSection
        title="Maintenance & Warranty Reports"
        description="Maintenance activity and warranty tracking"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReportItem
            title="Maintenance Logs"
            icon={<Wrench size={18} />}
            onClick={openMaintenanceLogsPreview}
          />

          <ReportItem
            title="Warranty / AMC Report"
            icon={<CalendarClock size={18} />}
            onClick={openWarrantyAMCPreview}
          />

          <ReportItem
            title="Expiring Soon"
            icon={<CalendarClock size={18} />}
            onClick={openExpiringWarrantyPreview}
          />
        </div>
      </ReportSection>
      {/* ASSIGNMENT */}
      <ReportSection
        title="Assignment & Movement Reports"
        description="Asset allocation and transfer history"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ReportItem
            title="Assignment History"
            icon={<UserSquare size={18} />}
            onClick={openAssignmentHistoryPreview}
          />

          <ReportItem
            title="Transfer Reports"
            icon={<ArrowLeftRight size={18} />}
            onClick={openTransferReportsPreview}
          />

          <ReportItem
            title="Employee Asset List"
            icon={<UserSquare size={18} />}
            onClick={openEmployeeAssetListPreview}
          />
        </div>
      </ReportSection>
      <ReportPreviewModal
        open={preview.open}
        title={preview.title}
        columns={preview.columns}
        rows={preview.rows}
        onClose={() => setPreview({ ...preview, open: false })}
        onExportPdf={reportExportMap[preview.title]?.pdf}
        onExportExcel={reportExportMap[preview.title]?.excel}
      >
        <ReportTable columns={preview.columns} rows={preview.rows} />
      </ReportPreviewModal>
    </div>
  );
};

export default AdminReports;
