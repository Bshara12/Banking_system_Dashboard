// src/pages/admin/Accounts.jsx
import { useEffect, useState } from "react";
import { accountsApi } from "../../api/accounts.api";
import "./Accounts.css";
import AccountDetails from "./AccountDetails";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAll();
    loadMeta();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await accountsApi.listAll();
      setAccounts(res.data);
    } catch (err) {
      console.error("load accounts error", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMeta() {
    try {
      const [tRes, sRes] = await Promise.all([accountsApi.getTypes(), accountsApi.getStatuses()]);
      setTypes(tRes.data);
      setStatuses(sRes.data);
    } catch (err) {
      console.error("load meta", err);
    }
  }

  const filtered = accounts.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        a.number?.toLowerCase().includes(q) ||
        a?.type?.name?.toLowerCase().includes(q) ||
        (a?.customer?.name ?? "")?.toLowerCase().includes(q) ||
        (a?.customer?.email ?? "")?.toLowerCase().includes(q)
      );
    }
    if (typeFilter && +typeFilter !== a.type?.id) return false;
    if (statusFilter && +statusFilter !== a.status?.id) return false;
    return true;
  });

  return (
    <div className="accounts-container">
      <div className="accounts-topbar">
        <input
          placeholder="Search account number / owner / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="accounts-grid">
        <div className="accounts-table">
          {loading ? <div>Loading...</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Balance</th>
                  <th>Children</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(acc => (
                  <tr key={acc.id}>
                    <td>{acc.number}</td>
                    <td>{acc.type?.name}</td>
                    <td><span className={`status-badge ${acc.status?.name}`}>{acc.status?.name}</span></td>
                    <td>{parseFloat(acc.balance).toFixed(4)}</td>
                    <td>{(acc.children || []).length}</td>
                    <td>
                      <button className="btn" onClick={() => setSelectedAccount(acc.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="accounts-side">
          <div className="card">
            <h4>Summary</h4>
            <p>Total accounts: {accounts.length}</p>
            <p>Filtered: {filtered.length}</p>
          </div>
        </div>
      </div>

      {selectedAccount && (
        <AccountDetails id={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}
    </div>
  );
}
