// src/pages/admin/AccountDetails.jsx
import { useEffect, useState } from "react";
import { accountsApi } from "../../api/accounts.api";
import "./AccountDetails.css";

export default function AccountDetails({ id, onClose }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await accountsApi.getTree(id);
      setTree(res.data);
    } catch (err) {
      console.error("load tree", err);
    } finally {
      setLoading(false);
    }
  }

  if (!id) return null;

  return (
    <div className="account-details-overlay">
      <div className="account-details-modal">
        <button className="close" onClick={onClose}>×</button>
        {loading ? <div>Loading...</div> : (
          <>
            <h3>{tree.number} — {tree.type}</h3>
            <p>Status: {tree.status}</p>
            <p>Balance: {tree.balance}</p>

            <h4>Children</h4>
            <ul>
              {tree.children?.map(c => (
                <li key={c.id}>
                  {c.number} — {c.type} — {c.balance}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
