import { useEffect, useState } from "react";
import api from "../api/axios";
import RequestTable from "../components/RequestTable";
import RequestHistoryTable from "../components/RequestHistoryTable";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    const res = await api.get("/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      <RequestTable onActionComplete={fetchRequests} />

      {/* Request History */}
      <RequestHistoryTable requests={requests} />
    </div>
  );
};

export default AdminRequests;
