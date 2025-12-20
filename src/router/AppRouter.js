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
import Reports from "../pages/admin/Reports";
import ManagerPage from "../pages/admin/ManagerPage";
import SupportLayout from "../layout/SupportLayout";
import SupportTicketsPage from "../pages/support/SupportTicketsPage";
import TicketChatPage from "../pages/support/TicketChatPage";
import TellerLayout from "../layout/TellerLayout";
import NewTransaction from "../pages/teller/NewTransaction";
import Notifications from "../layout/Notifications";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Admin Dashboard Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard role="admin" />} />
        <Route path="/admin/accounts" element={<Accounts />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/manager" element={<ManagerPage />} />
      </Route>
      {/* supported Dashboard Layout */}
      <Route path="/support" element={<SupportLayout />}>
        <Route path="/support/tickets" element={<SupportTicketsPage />} />
        <Route path="/support/tickets/:id" element={<TicketChatPage />} />
        <Route path="/support/transaction" element={<Transactions />} />
        <Route path="/support/accounts" element={<Accounts role="support" />} />

      </Route>

      <Route path="manager" element={<ManagerLayout />}>
        <Route index element={<AdminDashboard role="manager" />} />
        <Route path="/manager/accounts" element={<Accounts role="manager"/>} />
        <Route path="/manager/transactions" element={<Transactions />} />
        <Route path="/manager/requests" element={<TransactionRequests />} />
        <Route path="/manager/employees" element={<Employees />} />
        <Route path="/manager/logs" element={<Logs />} />
      </Route>

      <Route path="teller" element={<TellerLayout />}>
        <Route index element={<Accounts role="teller" />} />
        <Route path="/teller/new-transaction" element={<NewTransaction />} />
        <Route path="/teller/requests" element={<TransactionRequests />} />
        <Route path="/teller/transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}
