import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    // ✅ Frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMsg(res.data.message);

      // Redirect after success
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        {msg && (
          <p className="text-green-600 text-sm mb-3 text-center">
            {msg}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* NEW PASSWORD */}
          <input
            type="password"
            placeholder="New password"
            required
            className="w-full border p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm new password"
            required
            className="w-full border p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
