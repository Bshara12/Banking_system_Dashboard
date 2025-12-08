import { useEffect, useState } from "react";
import { transactionsApi } from "../../api/transactions.api";
import "./Transactions.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [statusChart, setStatusChart] = useState([]);
  const [stats24h, setStats24h] = useState(null);

  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      const [tRes, wRes, sRes, s24] = await Promise.all([
        transactionsApi.listAll(),
        transactionsApi.weekly(),
        transactionsApi.statusChart(),
        transactionsApi.stats24h(),
      ]);

      setTransactions(tRes.data || []);
      setWeekly(wRes.data || []);
      setStatusChart(sRes.data || []);
      setStats24h(s24.data || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter((tx) => {
    const s = search.toLowerCase();

    if (search) {
      if (
        tx.id.toString().includes(s) ||
        tx.type.toLowerCase().includes(s) ||
        tx.status.toLowerCase().includes(s) ||
        tx.employee_name?.toLowerCase().includes(s)
      ) {
        // do nothing
      } else return false;
    }

    if (typeFilter && tx.type !== typeFilter) return false;
    if (statusFilter && tx.status !== statusFilter) return false;
    if (employeeFilter && tx.employee_name !== employeeFilter) return false;

    // Date filter
    if (dateFrom && new Date(tx.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(tx.created_at) > new Date(dateTo)) return false;

    return true;
  });

  return (
    <div className="transactions-container">

      {/* Filters */}
      <div className="transactions-topbar">
        <input
          placeholder="Search by id / type / status / employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tx-input"
        />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="invoice">Invoice</option>
          <option value="transfer">Transfer</option>
          <option value="withdraw">Withdraw</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
        >
          <option value="">All employees</option>
          {[...new Set(transactions.map((x) => x.employee_name))].map((name) =>
            <option key={name} value={name}>{name}</option>
          )}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className="transactions-layout">

        {/* Table */}
        <div className="transactions-table">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Employee</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <td>{tx.id}</td>
                    <td>{tx.type}</td>

                    <td>
                      <span className={`tx-badge ${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>

                    <td>${parseFloat(tx.amount).toLocaleString()}</td>
                    <td>{tx.account_id}</td>
                    <td>{tx.account_related_id || "-"}</td>
                    <td>{tx.employee_name || "-"}</td>
                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Summary */}
        <div className="transactions-summary">
          <div className="card">
            <h4>Last 24 hours</h4>
            {stats24h ? (
              <>
                <p>Total: {stats24h.total}</p>
                <p>Success: {stats24h.success}</p>
                <p>Failed: {stats24h.failed}</p>
                <p>Pending: {stats24h.pending}</p>
              </>
            ) : (
              <p>No stats</p>
            )}
          </div>

          <div className="card">
            <h4>Weekly</h4>
            {weekly.map((day, i) => (
              <p key={i}>
                {day.day}: {day.total}
              </p>
            ))}
          </div>

          <div className="card">
            <h4>Status</h4>
            {statusChart.map((s) => (
              <p key={s.status}>
                {s.status}: {s.count}
              </p>
            ))}
          </div>
        </div>

      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
