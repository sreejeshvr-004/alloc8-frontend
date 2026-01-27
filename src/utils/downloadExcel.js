import api from "../api/axios";

export const downloadExcel = async (url, payload) => {
  const response = await api.post(url, payload, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${payload.title}.xlsx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
