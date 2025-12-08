import ModalCustomerPicker from "../../components/ui/ModalCustomerPicker";
import { logsApi } from "../../api/logs.api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import "./Logs.css";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ⭐ اختيار المستخدم عبر مودال
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [page]);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await logsApi.getAll(page);
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  }

  async function applyFilters() {
    setLoading(true);
    try {
      let res;

      if (selectedUser) {
        res = await logsApi.filterByUser(selectedUser.id, page);
      } else if (action) {
        res = await logsApi.filterByAction(action, page);
      } else if (dateFrom && dateTo) {
        res = await logsApi.filterByDateRange(dateFrom, dateTo, page);
      } else {
        res = await logsApi.getAll(page);
      }

      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Filter error");
    } finally {
      setLoading(false);
    }
  }

  async function exportLogs() {
    try {
      const res = await logsApi.export();

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "logs.csv";
      link.click();

      toast.success("Export completed!");
    } catch {
      toast.error("Export failed");
    }
  }

  const filtered = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.user.toLowerCase().includes(q) ||
      log.email.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">System Logs</h2>

      {/* ⭐ أدوات إضافية */}
      <div className="logs-tools">
        <button className="btn-export" onClick={exportLogs}>
          ⬇ Export CSV
        </button>

        <button
          className="btn-user"
          onClick={() => setShowCustomerPicker(true)}
        >
          👤 Select User
        </button>

        {selectedUser && (
          <div className="selected-user-badge">
            {selectedUser.name}
            <span onClick={() => setSelectedUser(null)}>✖</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="logs-filters">
        <input
          className="input"
          placeholder="Search user / action / description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="input"
        >
          <option value="">All Actions</option>
          <option value="Transaction Created">Transaction Created</option>
          <option value="Account Created">Account Created</option>
        </select>

        <input
          type="date"
          className="input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <button className="filter-btn" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {/* Logs Table */}
      <div className="logs-table-wrapper">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Action</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user}</td>
                  <td>{log.email}</td>
                  <td>
                    <span className={`action-badge`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.description}</td>
                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            disabled={page >= pagination.last_page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ⭐ مودال اختيار المستخدم */}
      {showCustomerPicker && (
        <ModalCustomerPicker
          onClose={() => setShowCustomerPicker(false)}
          onSelect={(user) => {
            setSelectedUser(user);
            setShowCustomerPicker(false);
          }}
        />
      )}
    </div>
  );
}