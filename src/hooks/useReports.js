import { useEffect, useState } from "react";
import { ReportsAPI } from "../api/reports.api";
import { toast } from "react-toastify";

export function useReports(range = "daily") {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);

    ReportsAPI.getTransactions(range)
      .then((res) => {
        setData(res.data.data);
      })
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  }, [range]);

  return { loading, data };
}

export function useAccountSummaries() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    ReportsAPI.getAccountSummaries()
      .then((res) => setRows(res.data.data))
      .catch(() => toast.error("Failed to load account summaries"))
      .finally(() => setLoading(false));
  }, []);

  return { loading, rows };
}
