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
      setTypes(tRes.data); // مثال: ["checking","savings","loan"]
      setStatuses(sRes.data); // مثال: ["active","inactive"]
    } catch (err) {
      console.error("load meta", err);
    }
  }

  /** =============================
   * FILTERING
   ============================= */
  const filtered = accounts.filter((a) => {
    const searchText = search.toLowerCase();

    if (search.length > 0) {
      return (
        a.number?.toLowerCase().includes(searchText) ||
        (a.type ?? "").toLowerCase().includes(searchText)
      );
    }

    if (typeFilter && typeFilter !== a.type) return false;
    if (statusFilter && statusFilter !== a.status) return false;

    return true;
  });

  /** =============================
   * HANDLERS
   ============================= */
  function openStatusModal(acc) {
    setStatusModalAcc(acc);
  }

  function closeStatusModal() {
    setStatusModalAcc(null);
  }

  async function addFeature(accountId, feature) {
    try {
      await accountsApi.addFeature(accountId, feature);
      await loadAll();
    } catch (err) {
      toast.error("Failed to add feature");
      console.error("add feature error", err);
    }
  }

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
      <div className="accounts-topbar">
        <input
          placeholder="Search account number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {/* <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select> */}

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        {/* <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select> */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* =================== TABLE ====================== */}
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
                    <span className={`status-badge status-${acc.status}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td>{Number(acc.balance).toFixed(4)}</td>
                  <td>{(acc.children || []).length}</td>

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
                        defaultValue=""
                        onChange={(e) =>
                          e.target.value && addFeature(acc.id, e.target.value)
                        }
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

                    {role !== "support" && (
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

      {/* =================== DETAILS ==================== */}
      {selectedAccount && (
        <AccountDetails
          id={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

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
