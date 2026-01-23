import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminAssetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchCategories = async () => {
    const res = await api.get("/asset-categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/asset-categories", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/asset-categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Asset Categories</h2>
        <button
          onClick={() => navigate("/admin/assets")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <form onSubmit={createCategory} className="bg-white p-4 rounded mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category Name"
          className="border p-2 rounded w-full mb-2"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>

      <div className="bg-white rounded shadow">
        {categories.length === 0 ? (
          <p className="p-4 text-gray-500">No categories found</p>
        ) : (
          <ul>
            {categories.map((c) => (
              <li
                key={c._id}
                className="flex justify-between items-center border-b p-3"
              >
                <span>{c.name}</span>
                <button
                  onClick={() => deleteCategory(c._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAssetCategories;
