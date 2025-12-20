import { useEffect, useState } from "react";
import { accountsApi } from "../../api/accounts.api";
import "./Accounts.css";
import AccountDetails from "./AccountDetails";
import ChangeStatusModal from "./components/ChangeStatusModal";
import { toast } from "react-toastify";

export default function Accounts({ role }) {
  const [accounts, setAccounts] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);
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
   - FILTERING
   =============================*/
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
   - HANDLERS
   =============================*/
  function openStatusModal(acc) {
    setStatusModalAcc(acc);
  }
  function closeStatusModal() {
    setStatusModalAcc(null);
  }

  // إضافة ميزة
  async function addFeature(accountId, feature) {
    try {
      await accountsApi.addFeature(accountId, feature);
      await loadAll();
    } catch (err) {
      toast.error("Failed to add feature");
      console.error("add feature error", err);
    }
  }

  // حذف ميزة
  async function removeFeature(accountId, feature) {
    try {
      await accountsApi.removeFeature(accountId, feature);
      await loadAll();
    } catch (err) {
      toast.error("Failed to remove feature");
      console.error("remove feature error", err);
    }
  }

  return (
    <div className="accounts-container">
      {/* =================== TOP FILTERS ====================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
                  {["manager", "teller"].includes(role) && <th>Features</th>}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((acc) => (
                  <tr key={acc.id}>
                    <td>{acc.number}</td>
                    <td>{acc.type}</td>

                    <td>
                      <span
                        className={`status-badge status-${acc.status?.toLowerCase()}`}
                      >
                        {acc.status}
                      </span>
                    </td>

                    <td>{parseFloat(acc.balance).toFixed(4)}</td>
                    <td>{(acc.children || []).length}</td>

                    {/* ميزات الحساب */}
                    {["manager", "teller"].includes(role) && (
                      <td>
                        <div className="features-list">
                          {(acc.features || []).map((f) => (
                            <span key={f} className="feature-badge">
                              {f}
                              <button
                                className="remove-btn"
                                onClick={() => removeFeature(acc.id, f)}
                              >
                                ✖
                              </button>
                            </span>
                          ))}
                        </div>
                        <select
                          onChange={(e) =>
                            e.target.value && addFeature(acc.id, e.target.value)
                          }
                          defaultValue=""
                        >
                          <option value="">+ Add Feature</option>
                          <option value="overdraft">Overdraft</option>
                          <option value="insurance">Insurance</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                    )}

                    <td>
                      <button
                        className="btn"
                        onClick={() => setSelectedAccount(acc.id)}
                      >
                        View
                      </button>

                      {role !== "teller" && (
                        <button
                          className="status-btn"
                          onClick={() => openStatusModal(acc)}
                        >
                          Change Status
                        </button>
                      )}
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
