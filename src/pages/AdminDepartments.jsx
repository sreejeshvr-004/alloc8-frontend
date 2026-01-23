import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const createDepartment = async () => {
    try {
      await api.post("/departments", { name });
      setName("");
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete department?")) return;
    await api.delete(`/departments/${id}`);
    fetchDepartments();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Departments</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={createDepartment}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Department
        </button>
      </div>

      <div className="bg-white rounded shadow">
        {departments.length === 0 ? (
          <p className="p-4 text-gray-500">No departments</p>
        ) : (
          departments.map((d) => (
            <div
              key={d._id}
              className="flex justify-between p-3 border-b"
            >
              <span>{d.name}</span>
              <button
                onClick={() => deleteDepartment(d._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/admin/users")}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default AdminDepartments;
