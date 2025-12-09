import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layout/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";

import Login from "../pages/auth/Login";
import Accounts from "../pages/admin/Accounts";
import Transactions from "../pages/admin/transactions";
import Logs from "../pages/admin/Logs";
import ManagerLayout from "../layout/ManagerLayout";
import TransactionRequests from "../pages/manager/TransactionRequests";
import Employees from "../pages/manager/Employees";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard role="admin" />} />
        <Route path="/admin/accounts" element={<Accounts role="admin"/>} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/logs" element={<Logs />} />
      </Route>

      <Route path="manager" element={<ManagerLayout />}>
        <Route index element={<AdminDashboard role="manager" />} />
        <Route path="/manager/accounts" element={<Accounts role="manager"/>} />
        <Route path="/manager/transactions" element={<Transactions />} />
        <Route path="/manager/requests" element={<TransactionRequests />} />
        <Route path="/manager/employees" element={<Employees />} />
        <Route path="/manager/logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
