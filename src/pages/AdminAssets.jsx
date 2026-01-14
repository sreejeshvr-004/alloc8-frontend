import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminAssets = () => {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    serialNumber: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAssets = async () => {
    const res = await api.get("/assets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(res.data);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createAsset = async (e) => {
    e.preventDefault();

    await api.post("/assets", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({ name: "", category: "", serialNumber: "" });
    fetchAssets();
  };

  const deleteAsset = async (id) => {
    await api.delete(`/assets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Assets</h2>

          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        {/* CREATE ASSET */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">Create New Asset</h3>

          <form onSubmit={createAsset} className="space-y-3">
            <input
              name="name"
              placeholder="Asset Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="category"
              placeholder="Category (Laptop, Phone, etc)"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="serialNumber"
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Create Asset
            </button>
          </form>
        </div>

        {/* ASSETS TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Assets</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{asset.category}</td>
                    <td className="p-2">{asset.status}</td>

                    <td className="p-2">
                      <button
                        onClick={() => deleteAsset(asset._id)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssets;