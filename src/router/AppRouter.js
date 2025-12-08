import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layout/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
// import AccountsPage from "../pages/admin/AccountsPage";
// import TransactionsPage from "../pages/admin/TransactionsPage";
// import ReportsPage from "../pages/admin/ReportsPage";
// import LogsPage from "../pages/admin/LogsPage";
// import SupportPage from "../pages/admin/SupportPage";

import Login from "../pages/auth/Login";
import Accounts from "../pages/admin/Accounts";

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
        {/* <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="support" element={<SupportPage />} /> */}
      </Route>
    </Routes>
  );
}
