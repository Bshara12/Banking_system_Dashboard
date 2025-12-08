import { useState } from "react";
import "./ChangeStatusModal.css";
import { accountsApi } from "../../../api/accounts.api";
import { toast } from "react-toastify";

export default function ChangeStatusModal({ account, onClose, onUpdated }) {
  const [newStatus, setNewStatus] = useState(account.status?.name);
  const [loading, setLoading] = useState(false);

  const statuses = ["active", "frozen", "suspended", "closed"];

  async function handleSubmit() {
    try {
      setLoading(true);
      await accountsApi.updateAccountStatus(account.id, { status: newStatus });

      onUpdated?.();

      onClose();
      toast.success("Account status updated!");
    } catch (err) {
      console.error("update status failed", err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Status</h3>

        <select
          className="modal-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn save"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
