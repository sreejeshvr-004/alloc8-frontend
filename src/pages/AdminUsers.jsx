import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import EmployeeAssetHistoryModal from "../components/EmployeeAssetHistoryModal";
import { downloadPdf } from "../utils/downloadPdf";
import EditEmployeeModal from "../components/EditEmployeeModal";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editUser, setEditUser] = useState(null);

  // FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    salary: "",
  });

  // 🔒 PASSWORD HINT (ADDED)
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // DEPARTMENT ACCORDION
  const [deptQuery, setDeptQuery] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data.map((d) => d.name));
    } catch {
      console.warn("Departments API not available");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    const res = await api.post(
      "/users",
      { ...form, role: "employee" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) => [res.data, ...prev]);

    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
      phone: "",
      salary: "",
    });
    setDeptQuery("");
    setDeptOpen(false);
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isDeleted: true } : u))
    );
  };

  const restoreUser = async (id) => {
    await api.put(
      `/users/${id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isDeleted: false } : u))
    );
  };

  /* ================= FILTERED USERS ================= */

  const filteredUsers = users
    .filter((u) => u.role === "employee")
    .filter((u) =>
      search
        ? u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((u) =>
      departmentFilter
        ? u.department?.toLowerCase().includes(departmentFilter.toLowerCase())
        : true
    )
    .filter((u) =>
      status ? (status === "active" ? !u.isDeleted : u.isDeleted) : true
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "department")
        return (a.department || "").localeCompare(b.department || "");
      if (sortBy === "status") return Number(a.isDeleted) - Number(b.isDeleted);
      return 0;
    });

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Users Management</h2>

          <div className="space-x-2">
            <button
              onClick={() =>
                downloadPdf("/users/export/all/pdf", "all-employees.pdf")
              }
              className="bg-indigo-600 text-white px-3 py-2 rounded"
            >
              Download Employees PDF
            </button>

            <button
              onClick={() => navigate("/admin/departments")}
              className="bg-indigo-500 text-white px-3 py-2 rounded"
            >
              Manage Departments
            </button>

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

        {/* CREATE EMPLOYEE */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">Create New Employee</h3>

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

            {/* 🔒 PASSWORD WITH HINT */}
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Temporary Password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
                className="w-full border p-2 rounded"
                required
              />

              {showPasswordHint && (
                <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 text-white text-xs rounded-md p-3 shadow-lg z-20">
                  <p className="font-semibold mb-1">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    <li>At least 1 uppercase letter (A–Z)</li>
                    <li>At least 1 number (0–9)</li>
                    <li>At least 1 symbol (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="salary"
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min="0"
            />

            {/* DEPARTMENT ACCORDION */}
            <div className="relative">
              {deptOpen && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setDeptOpen(false)}
                />
              )}

              <input
                type="text"
                placeholder="Select Department"
                value={deptQuery}
                onChange={(e) => {
                  setDeptQuery(e.target.value);
                  setDeptOpen(true);
                }}
                onFocus={() => setDeptOpen(true)}
                className="w-full border p-2 rounded relative z-10"
                required
              />

              {deptOpen && (
                <div className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                  {departments
                    .filter((d) =>
                      d.toLowerCase().includes(deptQuery.toLowerCase())
                    )
                    .map((d) => (
                      <div
                        key={d}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setForm({ ...form, department: d });
                          setDeptQuery(d);
                          setDeptOpen(false);
                        }}
                      >
                        {d}
                      </div>
                    ))}

                  {departments.length === 0 && (
                    <div className="p-2 text-gray-400">
                      No departments found
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Employee
            </button>
          </form>
        </div>

        {/* EMPLOYEES TABLE (UNCHANGED) */}
               <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Employees</h3>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-56"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Departments</option>

              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="name">Sort by Name</option>
              <option value="department">Sort by Department</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

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
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td
                      className="p-2 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedEmployeeId(user._id)}
                    >
                      {user.name}
                    </td>
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
                      <button
                        onClick={() => setEditUser(user)}
                        className="bg-indigo-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Edit
                      </button>

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

      {selectedEmployeeId && (
        <EmployeeAssetHistoryModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}

      {editUser && (
        <EditEmployeeModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={() => {
            fetchUsers();
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
