import api from "../api/axios";
import { useRef, useState, useEffect } from "react";
import { assetImageUrl } from "../utils/assetImage";

const AssetDetailsModal = ({ asset, onClose }) => {
  if (!asset) return null;

  const [images, setImages] = useState(asset.images || []);
  const fileInputRef = useRef(null);

  // Sync local images when asset changes
  useEffect(() => {
    setImages(asset.images || []);
  }, [asset]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Asset Details — {asset.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mb-6 pb-4 border-b">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Asset Images
          </h4>

          {images.length > 0 ? (
            <div className="flex gap-3 flex-wrap mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={assetImageUrl(img)}
                    className="w-24 h-24 rounded-lg border object-cover"
                  />

                  {/* DELETE IMAGE */}
                  <button
                    onClick={async () => {
                      await api.delete(`/assets/${asset._id}/images`, {
                        data: { imagePath: img },
                      });

                      setImages((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-3">No images uploaded</p>
          )}

          {/* ADD IMAGE BUTTON */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-dashed text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition"
          >
            ➕ Add Images
          </button>

          {/* HIDDEN FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              if (!files.length) return;

              const formData = new FormData();
              files.forEach((file) => formData.append("images", file));

              const res = await api.put(
                `/assets/${asset._id}/images`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
              );

              setImages(res.data.images);
              e.target.value = "";
            }}
          />
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <p>
            <strong>Category:</strong> {asset.category}
          </p>
          <p>
            <strong>Serial:</strong> {asset.serialNumber}
          </p>
          <p>
            <strong>Cost:</strong> ₹{asset.assetCost || "-"}
          </p>
          <p>
            <strong>Status:</strong> {asset.status}
          </p>
          <p>
            <strong>Purchase Date:</strong>{" "}
            {asset.purchaseDate
              ? new Date(asset.purchaseDate).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Warranty Expiry:</strong>{" "}
            {asset.warrantyExpiry
              ? new Date(asset.warrantyExpiry).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Assigned To:</strong> {asset.assignedTo?.name || "-"}
          </p>
          <p>
            <strong>Maintenance Count:</strong> {asset.maintenanceCount ?? 0}
          </p>
          <p>
            <strong>Total Maintenance Cost:</strong> ₹
            {asset.totalMaintenanceCost ?? 0}
          </p>
          <p>
            <strong>Created On:</strong>{" "}
            {new Date(asset.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
