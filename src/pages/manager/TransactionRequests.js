import { useEffect, useState } from "react";
import { transactionsApi } from "../../api/transactions.api";
import "./TransactionRequests.css";

export default function TransactionRequests() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sortByAmount, setSortByAmount] = useState(false);

  async function loadTransactions() {
    setLoading(true);
    try {
      const res = await transactionsApi.transactionRequests();
      setTransactions(res.data);
    } catch (e) {
      console.log("Error: " + e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) =>
    filterType === "all" ? true : t.type === filterType
  );

  const sortedTransactions = sortByAmount
    ? [...filteredTransactions].sort(
        (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
      )
    : filteredTransactions;

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await transactionsApi.approve(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.log("Error approving:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      await transactionsApi.reject(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.log("Error rejecting:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accounts-grid">
      {/* FILTERS */}
      <div className="filters">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="deposit">Deposit</option>
          <option value="invoice">Bill</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={sortByAmount}
            onChange={() => setSortByAmount(!sortByAmount)}
          />
          Sort by amount
        </label>
      </div>

      {/* TABLE */}
      <div className="accounts-table">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Account number</th>
                <th>Destination number</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    There is no transaction at this moment
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.employee_name}</td>
                    <td>{t.type}</td>
                    <td>{parseFloat(t.amount).toFixed(2)}</td>
                    <td>{t.description}</td>
                    <td>{t.account_number}</td>
                    <td>{t.account_related_number}</td>
                    <td>
                      <button className="btn" onClick={() => handleApprove(t.id)}>
                        Approve
                      </button>
                      <button
                        className="status-btn"
                        onClick={() => handleReject(t.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
