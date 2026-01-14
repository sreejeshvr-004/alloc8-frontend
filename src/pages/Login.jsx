import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);

      const role = JSON.parse(localStorage.getItem("user")).role;
      role === "admin" ? navigate("/admin") : navigate("/employee");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

 return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    {/* PROJECT TITLE */}
    <div className="mb-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-widest text-gray-800">
        ALLOC&nbsp;8
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Smart Asset Allocation System
      </p>
    </div>

    {/* LOGIN CARD */}
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Login
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium">
          Login
        </button>
      </form>
    </div>
  </div>
);
};
export default Login;