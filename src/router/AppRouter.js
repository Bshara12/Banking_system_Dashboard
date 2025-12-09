import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layout/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";

import Login from "../pages/auth/Login";
import Accounts from "../pages/admin/Accounts";
import Transactions from "../pages/admin/transactions";
import Logs from "../pages/admin/Logs";
import Reports from "../pages/admin/Reports";
import ManagerPage from "../pages/admin/ManagerPage";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/accounts" element={<Accounts />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/manager" element={<ManagerPage />} />
      </Route>
    </Routes>
  );
}
