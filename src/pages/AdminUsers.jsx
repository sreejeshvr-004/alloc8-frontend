import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    await api.post(
      "/users",
      {
        ...form,
        role: "employee",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
    });

    fetchUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchUsers();
  };

  const restoreUser = async (id) => {
    await api.put(
      `/users/${id}/restore`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Users Management</h2>

          <div className="space-x-2">
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CREATE USER */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">
            Create New Employee
          </h3>

          <form onSubmit={createUser} className="space-y-3">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Employee
            </button>
          </form>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Employees</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users
                  .filter((u) => u.role === "employee")
                  .map((user) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.department}</td>

                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user.isDeleted
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isDeleted ? "Inactive" : "Active"}
                        </span>
                      </td>

                      <td className="p-2 space-x-2">
                        {!user.isDeleted ? (
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => restoreUser(user._id)}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Restore
                          </button>
                        )}
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

export default AdminUsers;