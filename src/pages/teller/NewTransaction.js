import { useState } from "react";
import { getAccountUser, transaction } from "../../api/dashboard.api";
import "./NewTransaction.css";
import { toast } from "react-toastify";

export default function NewTransaction() {
  const [account_number, setAccountId] = useState("");
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "deposit",
    amount: "",
    employee_name: "",
    description: "",
    account_related_id: "",
  });

  const handleSearch = async () => {
    try {
      const res = await getAccountUser(account_number);
      if (res.data) {
        setUser(res.data);
        setShowModal(true);
      } else {
        console.log("Error search: User not found");
      }
    } catch (e) {
      toast.error(e.response.data.message || "Error searching");
      console.log("Error search:", e);
    }
  };

  const handleCreate = async () => {
    try {
      const data = {
        account_id: account_number,
        type: formData.type,
        amount: formData.amount,
        employee_name: formData.employee_name,
        description: formData.description,
        account_related_id:
          formData.type === "transfer" ? formData.account_related_id : null,
      };
      await transaction(data);
      console.log("Transaction created successfully");
      setFormData({ type: "deposit", amount: "", account_related_id: "" });
      setAccountId("");
      setUser(null);
      setShowModal(false);
      toast.success("Transaction created successfully");
    } catch (e) {
      toast.error(e.response.data.message || "Error creating transaction");
      console.log("Error creating transaction:", e);
    }
  };

  return (
    <div className="new-transaction">
      <h2>New Transaction</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Account ID"
          value={account_number}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <button className="btn" onClick={handleSearch}>
          Search User
        </button>
      </div>

      {showModal && user && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Information</h3>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <h3>Transaction Details</h3>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
              <option value="transfer">Transfer</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Employee name"
              value={formData.employee_name}
              onChange={(e) =>
                setFormData({ ...formData, employee_name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* يظهر فقط إذا كان نوع العملية Transfer */}
            {formData.type === "transfer" && (
              <input
                type="text"
                placeholder="Related Account ID"
                value={formData.account_related_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    account_related_id: e.target.value,
                  })
                }
              />
            )}

            <div className="modal-actions">
              <button className="btn" onClick={handleCreate}>
                Create Transaction
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
