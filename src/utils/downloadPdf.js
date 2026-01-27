import api from "../api/axios";

export const downloadPdf = async (url, payload) => {
  const response = await api.post(url, payload, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${payload.title}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
