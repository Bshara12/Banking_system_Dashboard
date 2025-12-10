import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminLayout.css";
import { useAuth } from "../hooks/useAuth";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function ManagerLayout({ children }) {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const itemClass = (path) =>
    `menu-item ${activePath === path ? "active" : ""} ${!open ? "collapsed" : ""}`;

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <motion.div
        animate={{ width: open ? 250 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sidebar ${!open ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{open ? "Manager Panel" : "MP"}</h2>

          {/* زر السهم */}
          <motion.button
            className="toggle-btn"
            onClick={() => setOpen(!open)}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            ➤
          </motion.button>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/manager"
            end
            className={itemClass("/manager")}
            onClick={() => setActivePath("/manager")}
          >
            🏠 <span className="label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/manager/accounts"
            className={itemClass("/manager/accounts")}
            onClick={() => setActivePath("/manager/accounts")}
          >
            💳 <span className="label">Accounts</span>
          </NavLink>

          <NavLink
            to="/manager/transactions"
            className={itemClass("/manager/transactions")}
            onClick={() => setActivePath("/manager/transactions")}
          >
            📊 <span className="label">Transactions</span>
          </NavLink>

          <NavLink
            to="/manager/requests"
            className={itemClass("/manager/requests")}
            onClick={() => setActivePath("/manager/requests")}
          >
            📥 <span className="label">Transaction Requests</span>
          </NavLink>

          <NavLink
            to="/manager/employees"
            className={itemClass("/manager/employees")}
            onClick={() => setActivePath("/manager/employees")}
          >
            👥 <span className="label">Employees</span>
          </NavLink>

          <NavLink
            to="/manager/logs"
            className={itemClass("/manager/logs")}
            onClick={() => setActivePath("/manager/logs")}
          >
            📁 <span className="label">Logs</span>
          </NavLink>

        </nav>
      </motion.div>

      {/* Main content area */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Welcome, {user?.name}</h1>
          </div>

          <div className="header-right">
            <button className="notif-btn">🔔</button>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}