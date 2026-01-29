import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { downloadPdf } from "../utils/downloadPdf";

import AssetDetailsModal from "../components/AssetDetailsModal";
import ConfirmDeactivateModal from "../components/ConfirmDeactivateModal";
import MobileAssetCard from "../components/mobile/MobileAssetCard";

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ===== FORM STATE =====
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

    if (!form.name.trim()) {
    alert("Asset name is required");
    return;
  }

  if (!form.category) {
    alert("Please select a category from the list");
    return;
  }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    await api.post("/assets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setForm({
      name: "",
      category: "",
      assetCost: "",
      purchaseDate: "",
      warrantyExpiry: "",
    });
    setImages([]);
    setImagePreviews([]);

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
    <div className=" bg-gray-100">
      <div className="mx-auto p-4 md:p-6 md:max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <div
            className="
      flex flex-col gap-4
      md:flex-row md:items-center md:justify-between
    "
          >
            {/* Title */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Manage Assets
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Create, view, and manage company assets
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/assets/categories")}
                className="
          px-4 py-2 text-sm font-medium
          rounded-lg border
          bg-white text-gray-700
          hover:bg-gray-50
          transition
        "
              >
                Manage Categories
              </button>

              <button
                onClick={() => navigate("/admin")}
                className="
          px-4 py-2 text-sm font-medium
          rounded-lg
          bg-gray-900 text-white
          hover:bg-gray-800
          transition
        "
              >
                Back
              </button>
            </div>
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
              required
              placeholder="Cost"
              value={form.assetCost}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <label className="text-sm text-gray-600">Purchase Date</label>
            <input
              name="purchaseDate"
              type="date"
              required
              value={form.purchaseDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <label className="text-sm text-gray-600">Warranty Expiry</label>
            <input
              name="warrantyExpiry"
              type="date"
              required
              value={form.warrantyExpiry}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <div>
              <label className="text-sm text-gray-600">Asset Images</label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setImages(files);

                  const previews = files.map((file) =>
                    URL.createObjectURL(file),
                  );
                  setImagePreviews(previews);
                }}
                className="w-full border p-2 rounded"
              />

              {/* PREVIEW */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      className="w-16 h-16 rounded border object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Create Asset
            </button>
          </form>
        </div>

        {/* ================= ASSETS TABLE ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Assets</h3>

          <div className="overflow-x-auto">
            {/* FILTER BAR */}
            <div className="mb-4">
              {/* Mobile toggle */}
              <div className="flex items-center justify-between md:hidden">
                <input
                  type="text"
                  placeholder="Search assets"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 rounded flex-1 mr-2"
                />

                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="border px-3 py-2 rounded bg-gray-100"
                  aria-label="Toggle filters"
                >
                  ☰
                </button>
              </div>

              {/* Desktop filters */}
              <div className="hidden md:flex flex-wrap gap-3 mt-3">
                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search by name or serial"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 rounded w-64"
                />

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

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
              </div>

              {/* Mobile expanded filters */}
              {filtersOpen && (
                <div className="md:hidden mt-3 space-y-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="az">Name A-Z</option>
                    <option value="za">Name Z-A</option>
                  </select>
                </div>
              )}
            </div>

            <div className="hidden md:block">
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
                          ? new Date(asset.warrantyExpiry).toLocaleDateString("en-GB")
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
            </div>

            {assets.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No assets found</p>
            )}
          </div>
          {/* ================= MOBILE ASSET CARDS ================= */}
          <div className="md:hidden space-y-3">
            {filteredAssets.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No assets found
              </p>
            ) : (
              filteredAssets.map((asset) => (
                <MobileAssetCard
                  key={asset._id}
                  asset={asset}
                  onView={(a) => {
                    setSelectedAsset(a);
                    setShowAssetModal(true);
                  }}
                  onRemove={(a) => {
                    setSelectedAsset(a);
                    setShowConfirmModal(true);
                  }}
                />
              ))
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
