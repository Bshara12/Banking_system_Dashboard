import { useEffect, useState } from "react";
import "./manager.css";
import { ManagerAPI } from "../../api/manager.api";
import AddManagerModal from "../../components/ui/AddManagerModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-toastify";

export default function ManagerPage() {
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);

  // For delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadManagers();
  }, []);

  async function loadManagers() {
    try {
      const res = await ManagerAPI.getEmployees();
      const all = res.data || [];

      // Show only users with role_id = 2 (manager)
      const filtered = all.filter((u) => u.role_id === 2);

      setManagers(filtered);
    } catch (err) {
      console.error("Error loading managers:", err);
      toast.error("Failed to load managers!");
    }
  }

  function askDelete(id) {
    setSelectedId(id);
    setConfirmOpen(true);
  }

  async function deleteManager() {
    try {
      await ManagerAPI.deleteUser(selectedId);

      setManagers((prev) => prev.filter((m) => m.id !== selectedId));

      toast.success("Manager deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete manager!");
    } finally {
      setConfirmOpen(false);
    }
  }

  const filteredManagers = managers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Managers</h2>

        <div className="manager-controls">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="add-btn" onClick={() => setOpenAdd(true)}>
            + Add Manager
          </button>
        </div>
      </div>

      <div className="manager-list">
        {filteredManagers.length === 0 && (
          <p className="empty-msg">No managers found.</p>
        )}

        {filteredManagers.map((m) => (
          <div key={m.id} className="manager-card">
            <div className="info">
              <h3>{m.name}</h3>
              <p>Email: {m.email}</p>
              <p>Phone: {m.phone || "—"}</p>
            </div>

            <button className="delete-btn" onClick={() => askDelete(m.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Manager Modal */}
      {openAdd && (
        <AddManagerModal
          onClose={() => setOpenAdd(false)}
          onCreated={loadManagers}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Manager"
        message="Are you sure you want to delete this manager?"
        onConfirm={deleteManager}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
