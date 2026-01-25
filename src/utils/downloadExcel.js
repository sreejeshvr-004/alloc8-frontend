import api from "../api/axios";

export const downloadExcel = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert("Failed to download Excel");
    console.error(error);
  }
};
