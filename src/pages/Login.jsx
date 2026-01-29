import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../asset/Alloc8logo.png";

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
      
      {/* LOGO + TITLE */}
      <div className="mb-8 text-center">
        <img
          src={logo}
          alt="ALLOC 8 Logo"
          className="w-69 mx-auto mb-1 h-25"
        />

       
      </div>

      {/* LOGIN CARD */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-95">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right">
            <button
            type="button"
            onClick={()=> navigate("forgot-password")}
            className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;