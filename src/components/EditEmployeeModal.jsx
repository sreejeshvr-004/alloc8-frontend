import { useEffect, useState } from "react";
import api from "../api/axios";

const EditEmployeeModal = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    department: "",
    phone: "",
    salary: "",
  });

  const [departments, setDepartments] = useState([]);
  const [deptQuery, setDeptQuery] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= INIT ================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      department: user.department || "",
      phone: user.phone || "",
      salary: user.salary || "",
    });

    setDeptQuery(user.department || "");
  }, [user]);

  useEffect(() => {
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

    fetchDepartments();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await api.put(
      `/users/${user._id}`,
      {
        name: form.name,
        department: form.department,
        phone: form.phone,
        salary: form.salary,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onUpdated();
  };

  /* ================= UI ================= */
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-105"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>

        {/* NAME */}
        <label className="text-sm font-medium">Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        {/* EMAIL (READ ONLY) */}
        <label className="text-sm font-medium">Email</label>
        <input
          value={user.email}
          disabled
          className="w-full border p-2 rounded mb-3 bg-gray-100 cursor-not-allowed"
        />

        {/* DEPARTMENT ACCORDION */}
        <label className="text-sm font-medium">Department</label>
        <div className="relative mb-3">
          {deptOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setDeptOpen(false)}
            />
          )}

          <input
            value={deptQuery}
            onChange={(e) => {
              setDeptQuery(e.target.value);
              setDeptOpen(true);
            }}
            onFocus={() => setDeptOpen(true)}
            className="w-full border p-2 rounded relative z-10"
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
            </div>
          )}
        </div>

        {/* PHONE */}
        <label className="text-sm font-medium">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        {/* SALARY */}
        <label className="text-sm font-medium">Salary</label>
        <input
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1.5 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
