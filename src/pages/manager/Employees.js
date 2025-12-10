import React, { useEffect, useState } from "react";
import {
  loadEmployees,
  createEmployee,
  removeEmployee,
} from "../../api/dashboard.api";
import "./Employees.css";

export default function Employees() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await loadEmployees();
      setUsers(res.data);
    } catch (e) {
      console.log("Error: " + e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    try {
      setShowModal(false);
      setLoading(true);
      await createEmployee({ ...newUser, role_id: 4 });
      setNewUser({ name: "", email: "", password: "", phone: "" });
      setShowModal(false);
      await loadUsers();
    } catch (e) {
      console.log("Error creating:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await removeEmployee(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.log("Error deleting:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accounts-grid">
      <h2>Employees</h2>

      <button
        style={{ width: "fit-content" }}
        className="btn"
        onClick={() => setShowModal(true)}
      >
        + Add Employee
      </button>

      <div className="accounts-table">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <button
                      className="status-btn"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Employee</h3>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="btn" onClick={handleCreate}>
                Save
              </button>
              <button
                className="status-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
