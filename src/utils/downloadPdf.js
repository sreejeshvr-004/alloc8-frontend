import api from "../api/axios";

export const downloadPdf = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert("Failed to download PDF");
    console.error(error);
  }
};

export const downloadUserFullReport = async () => {
  try {
    const res = await api.get(
      `/users/${employeeId}/full-report/pdf`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `employee-${employeeId}-asset-report.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to download user report");
    console.error(err);
  }
};
