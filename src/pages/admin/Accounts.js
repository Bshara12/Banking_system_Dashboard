// src/pages/admin/Accounts.jsx
import { useEffect, useState } from "react";
import { accountsApi } from "../../api/accounts.api";
import "./Accounts.css";
import AccountDetails from "./AccountDetails";
import ChangeStatusModal from "./components/ChangeStatusModal";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [statusModalAcc, setStatusModalAcc] = useState(null);

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
      const [tRes, sRes] = await Promise.all([
        accountsApi.getTypes(),
        accountsApi.getStatuses(),
      ]);
      setTypes(tRes.data);
      setStatuses(sRes.data);
    } catch (err) {
      console.error("load meta", err);
    }
  }

  /** =============================
   *  FILTERING
   * =============================*/
  const filtered = accounts.filter((a) => {
    const searchText = search.toLowerCase();

    if (search.length > 0) {
      return (
        a.number?.toLowerCase().includes(searchText) ||
        a?.type?.name?.toLowerCase().includes(searchText) ||
        (a?.customer?.name ?? "").toLowerCase().includes(searchText) ||
        (a?.customer?.email ?? "").toLowerCase().includes(searchText)
      );
    }

    if (typeFilter && +typeFilter !== a.type?.id) return false;
    if (statusFilter && +statusFilter !== a.status?.id) return false;

    return true;
  });

  /** =============================
   *  HANDLERS
   * =============================*/
  // const openStatusModal = (acc) => {
  //   setStatusModal(acc);
  // };

  // const refreshData = () => {
  //   loadAll();
  // };

  function openStatusModal(acc) {
    setStatusModalAcc(acc);
  }

  function closeStatusModal() {
    setStatusModalAcc(null);
  }

  return (
    <div className="accounts-container">
      {/* =================== TOP FILTERS ====================== */}
      <div className="accounts-topbar">
        <input
          placeholder="Search account number / owner / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* =================== GRID ====================== */}
      <div className="accounts-grid">
        {/* TABLE */}
        <div className="accounts-table">
          {loading ? (
            <div>Loading...</div>
          ) : (
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
                {filtered.map((acc) => (
                  <tr key={acc.id}>
                    <td>{acc.number}</td>
                    <td>{acc.type?.name}</td>

                    <td>
                      <span
                        className={`status-badge status-${acc.status?.name.toLowerCase()}`}
                      >
                        {acc.status?.name}
                      </span>
                    </td>

                    <td>{parseFloat(acc.balance).toFixed(4)}</td>
                    <td>{(acc.children || []).length}</td>

                    <td>
                      <button
                        className="btn"
                        onClick={() => setSelectedAccount(acc.id)}
                      >
                        View
                      </button>

                      <button
                        className="status-btn"
                        onClick={() => openStatusModal(acc)}
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SUMMARY CARD */}
        <div className="accounts-side">
          <div className="card">
            <h4>Summary</h4>
            <p>Total accounts: {accounts.length}</p>
            <p>Filtered: {filtered.length}</p>
          </div>
        </div>
      </div>

      {/* =================== ACCOUNT DETAILS ==================== */}
      {selectedAccount && (
        <AccountDetails
          id={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      {/* =================== STATUS MODAL ==================== */}
      {/* {statusModal && (
        <ChangeStatusModal
          account={statusModal}
          onClose={() => setStatusModal(null)}
          onUpdated={refreshData}
        />
      )} */}
      {statusModalAcc && (
        <ChangeStatusModal
          account={statusModalAcc}
          onClose={closeStatusModal}
          onUpdated={loadAll}
        />
      )}
    </div>
  );
}
