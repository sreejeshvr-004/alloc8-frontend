import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { downloadPdf } from "../utils/downloadPdf";

import AssetDetailsModal from "../components/AssetDetailsModal";
import ConfirmDeactivateModal from "../components/ConfirmDeactivateModal";

const AdminAssets = () => {
  const [assets, setAssets] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ===== TABLE CONTROLS =====
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");

  // ===== FORM STATE =====
  const [form, setForm] = useState({
    name: "",
    category: "",
    assetCost: "",
    purchaseDate: "",
    warrantyExpiry: "",
  });

  // ===== CATEGORY DROPDOWN (ACCORDION STYLE) =====
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // ===== FETCH ASSETS =====
  const fetchAssets = async () => {
    const res = await api.get("/assets");
    setAssets(res.data);
  };

  // ===== FETCH CATEGORIES =====
  const fetchCategories = async () => {
    try {
      const res = await api.get("/asset-categories");
      setCategories(res.data.map((c) => c.name));
    } catch (error) {
      // 🔹 API not ready yet — fallback
      setCategories([]);
      console.warn("Asset categories API not available yet");
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchCategories();
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createAsset = async (e) => {
    e.preventDefault();

    await api.post("/assets", form);

    setForm({
      name: "",
      category: "",
      assetCost: "",
      purchaseDate: "",
      warrantyExpiry: "",
    });

    setCategoryQuery("");
    setCategoryOpen(false);

    fetchAssets();
  };

  const deleteAsset = async (id) => {
    await api.delete(`/assets/${id}`);
    fetchAssets();
  };

  const filteredAssets = assets
    .filter((a) => {
      const searchMatch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.serialNumber?.toLowerCase().includes(search.toLowerCase());

      const statusMatch = statusFilter === "all" || a.status === statusFilter;

      const categoryMatch =
        categoryFilter === "all" || a.category === categoryFilter;

      return searchMatch && statusMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "az") {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Assets</h2>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin/assets/categories")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Manage Categories
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() =>
                downloadPdf("/assets/export/all/pdf", "all-assets.pdf")
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Download All Assets PDF
            </button>
          </div>
        </div>

        {/* ================= CREATE ASSET ================= */}
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

            {/* ===== CATEGORY ACCORDION ===== */}
            <div className="relative">
              {categoryOpen && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setCategoryOpen(false)}
                />
              )}

              <input
                type="text"
                placeholder="Select Asset Category"
                value={categoryQuery}
                onChange={(e) => {
                  setCategoryQuery(e.target.value);
                  setCategoryOpen(true);
                }}
                onFocus={() => setCategoryOpen(true)}
                className="w-full border p-2 rounded relative z-10"
                required
              />

              {categoryOpen && (
                <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                  {categories
                    .filter((cat) =>
                      cat.toLowerCase().includes(categoryQuery.toLowerCase()),
                    )
                    .map((cat) => (
                      <div
                        key={cat}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setForm({ ...form, category: cat });
                          setCategoryQuery(cat);
                          setCategoryOpen(false);
                        }}
                      >
                        {cat}
                      </div>
                    ))}

                  {categories.filter((cat) =>
                    cat.toLowerCase().includes(categoryQuery.toLowerCase()),
                  ).length === 0 && (
                    <div className="p-2 text-gray-400">No results</div>
                  )}
                </div>
              )}
            </div>

            <input
              name="assetCost"
              type="number"
              placeholder="Cost"
              value={form.assetCost}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <label className="text-sm text-gray-600">Purchase Date</label>
            <input
              name="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <label className="text-sm text-gray-600">Warranty Expiry</label>
            <input
              name="warrantyExpiry"
              type="date"
              value={form.warrantyExpiry}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Create Asset
            </button>
          </form>
        </div>

        {/* ================= ASSETS TABLE ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Assets</h3>

          <div className="overflow-x-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search by name or serial"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-64"
              />

              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* CATEGORY FILTER */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* SORT */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="az">Name A–Z</option>
                <option value="za">Name Z–A</option>
              </select>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Serial</th>
                  <th className="p-2 text-left">Cost</th>
                  <th className="p-2 text-left">Warranty</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Assigned</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (

                  <tr
                    key={asset._id}
                    className={`border-t hover:bg-gray-50 ${
                      asset.status === "inactive" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{asset.category}</td>
                    <td className="p-2 text-xs">{asset.serialNumber}</td>
                    <td className="p-2">₹{asset.assetCost || 0}</td>
                    <td className="p-2">
                      {asset.warrantyExpiry
                        ? new Date(asset.warrantyExpiry).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          asset.status === "available"
                            ? "bg-green-100 text-green-700"
                            : asset.status === "inactive"
                              ? "bg-gray-200 text-gray-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-2">{asset.assignedTo?.name || "-"}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowAssetModal(true);
                        }}
                        className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        disabled={asset.status === "inactive"}
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowConfirmModal(true);
                        }}
                        className={`text-xs px-2 py-1 rounded ${
                          asset.status === "inactive"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {assets.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No assets found</p>
            )}
          </div>
        </div>
      </div>

      {showAssetModal && (
        <AssetDetailsModal
          asset={selectedAsset}
          onClose={() => setShowAssetModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmDeactivateModal
          asset={selectedAsset}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={async () => {
            await deleteAsset(selectedAsset._id);
            setShowConfirmModal(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminAssets;
