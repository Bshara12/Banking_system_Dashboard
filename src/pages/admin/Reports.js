import { useEffect, useState, useMemo } from "react";
import "./reports.css";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import { groupTransactionsByDay } from "../../utils/groupByDay";
import { exportCSV } from "../../utils/exportCSV";
import { exportPDF } from "../../utils/exportPDF";
import { ReportsAPI } from "../../api/reports.api";

export default function Reports() {
  const [range, setRange] = useState("weekly");
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, [range]);

  async function load() {
    try {
      const res = await ReportsAPI.getTransactions(range);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  // Group by day (Line chart)
  const grouped = useMemo(() => groupTransactionsByDay(data), [data]);
  const lineLabels = grouped.map((x) => x.day);
  const lineSeries = grouped.map((x) => x.total);

  // Pie chart (status)
  const statusMap = useMemo(() => {
    const map = {};
    data.forEach((t) => {
      map[t.status] = (map[t.status] || 0) + 1;
    });
    return map;
  }, [data]);

  const pieLabels = Object.keys(statusMap);
  const pieValues = Object.values(statusMap);

  // Bar chart (type)
  const typeMap = useMemo(() => {
    const map = {};
    data.forEach((t) => {
      map[t.type] = (map[t.type] || 0) + 1;
    });
    return map;
  }, [data]);

  const barLabels = Object.keys(typeMap);
  const barValues = Object.values(typeMap);

  return (
    <div className="reports-container">

      <div className="reports-header">
        <h2>Reports</h2>

        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <div className="export-buttons">
          <button onClick={() => exportCSV("transactions_report", data)}>
            Export CSV
          </button>

          <button onClick={() => exportPDF("transactions_report", data)}>
            Export PDF
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Transactions Over Time</h3>
          <LineChart labels={lineLabels} series={lineSeries} />
        </div>

        <div className="chart-card">
          <h3>Status Distribution</h3>
          <PieChart labels={pieLabels} values={pieValues} />
        </div>

        <div className="chart-card">
          <h3>Transaction Types</h3>
          <BarChart labels={barLabels} values={barValues} />
        </div>
      </div>

      {/* Raw table */}
      <div className="reports-table">
        <h3>Raw Data</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Type</th>
              <th>Date</th>
              <th>Account</th>
            </tr>
          </thead>

          <tbody>
            {data.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.amount}</td>
                <td>{t.status}</td>
                <td>{t.type}</td>
                <td>{t.date.substring(0, 19)}</td>
                <td>{t.account_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
