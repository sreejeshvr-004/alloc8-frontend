import { useEffect, useState } from "react";
import api from "../api/axios";

const ApproveRequestModal = ({ request, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);

  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let mounted = true;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await api.get("/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        const filtered = res.data.filter(
          (a) =>
            a.category === request.assetCategory &&
            a.status === "available" &&
            !a.isDeleted,
        );

        setAssets(filtered);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAssets();

    return () => {
      mounted = false;
    };
  }, [request._id]);

  const approve = async () => {
    await api.put(
      `/requests/${request._id}`,
      {
        status: "approved",
        assetId: selectedAsset,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-90% max-w-md rounded-xl p-5 shadow">
        <h3 className="text-lg font-semibold mb-3">Approve Request</h3>

        <p className="text-sm mb-2">
          <b>Employee:</b> {request.user?.name}
        </p>
        <p className="text-sm mb-4">
          <b>Requested Category:</b> {request.assetCategory}
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Checking available assets…</p>
        ) : assets.length === 0 ? (
          <p className="text-red-600 text-sm">
            No available assets for this category.
          </p>
        ) : (
          <select
            className="border rounded w-full p-2 text-sm mb-4"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
          >
            <option value="">Select asset</option>
            {assets.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.serialNumber})
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded bg-gray-200"
          >
            Cancel
          </button>

          <button
            disabled={!selectedAsset || loading}
            onClick={approve}
            className={`px-3 py-1 text-sm rounded text-white ${
              selectedAsset
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Approve & Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestModal;
