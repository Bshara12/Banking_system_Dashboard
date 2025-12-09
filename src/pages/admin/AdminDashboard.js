import { useEffect, useState } from "react";
import {
  getSystemHealth,
  getWeeklyTransactions,
  getTransactionStatus,
  getAccountsMonthly,
  getTopCustomers,
  getAccountsToday,
  getTransactions24h,
  getRecentLogs,
} from "../../api/dashboard.api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./AdminDashboard.css";

export default function AdminDashboard({ role }) {
  const [health, setHealth] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [status, setStatus] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [top, setTop] = useState([]);
  const [todayAccounts, setTodayAccounts] = useState(null);
  const [todayTx, setTodayTx] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const h = await getSystemHealth();
    const w = await getWeeklyTransactions();
    const s = await getTransactionStatus();
    const m = await getAccountsMonthly();
    const t = await getTopCustomers();
    const a = await getAccountsToday();
    const tx = await getTransactions24h();
    const lg = await getRecentLogs();

    setHealth(h.data);
    setWeekly(w.data);
    setStatus(s.data);
    setMonthly(m.data);
    setTop(t.data);
    setTodayAccounts(a.data.count);
    setTodayTx(tx.data.count);
    setLogs(lg.data.data);
  };

  return (
    <div className="dashboard-wrapper">
      {/* =================== TOP STATS =================== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Accounts Created Today</h3>
          <p className="stat-number">{todayAccounts ?? "-"}</p>
        </div>

        <div className="stat-card">
          <h3>Transactions Last 24h</h3>
          <p className="stat-number">{todayTx ?? "-"}</p>
        </div>

        {role === "admin" && (
          <>
            <div className="stat-card">
              <h3>Database</h3>
              {health && <p className="stat-number">{health.db.status}</p>}
            </div>

            <div className="stat-card">
              <h3>Queue Status</h3>
              {health && (
                <p className="stat-number">
                  {health.queue.status} ({health.queue.failed_jobs} fails)
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {/* =================== CHARTS =================== */}
      {/* <div className="chart-section">
          <div className="chart-card">
            <h3>Weekly Transactions</h3>
            <pre>{JSON.stringify(weekly, null, 2)}</pre>
          </div>

          <div className="chart-card">
            <h3>Transactions Status</h3>
            <pre>{JSON.stringify(status, null, 2)}</pre>
          </div>
        </div> */}
      <div className="chart-section">
        {/* WEEKLY TRANSACTIONS */}
        <div className="chart-card">
          <h3>Weekly Transactions</h3>
          <LineChart width={450} height={250} data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4F8EF7"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* STATUS PIE CHART */}
        <div className="chart-card">
          <h3>Transactions Status</h3>
          <PieChart width={450} height={250}>
            <Pie
              data={status}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {status.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.status === "succeeded" ? "#4CAF50" : "#F44336"}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* =================== TOP CUSTOMERS =================== */}
      <div className="table-card">
        <h3>Top Customers</h3>

        <table className="nice-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Transactions</th>
            </tr>
          </thead>

          <tbody>
            {top.map((c) => (
              <tr key={c.user_id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.total_amount}</td>
                <td>{c.tx_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =================== SYSTEM LOGS =================== */}
      <div className="table-card">
        <h3>Recent Logs</h3>

        <table className="nice-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{l.user}</td>
                <td>{l.action}</td>
                <td>{l.description}</td>
                <td>{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
