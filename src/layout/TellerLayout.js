import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminLayout.css";
import { useAuth } from "../hooks/useAuth";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function TellerLayout({ children }) {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const itemClass = (path) =>
    `menu-item ${activePath === path ? "active" : ""} ${
      !open ? "collapsed" : ""
    }`;

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
            to="/teller"
            end
            className={itemClass("/teller")}
            onClick={() => setActivePath("/teller")}
          >
            💳 <span className="label">Accounts</span>
          </NavLink>

          <NavLink
            to="/teller/new-transaction"
            className={itemClass("/teller/new-transaction")}
            onClick={() => setActivePath("/teller/new-transaction")}
          >
            💸 <span className="label">New Transaction</span>
          </NavLink>

          <NavLink
            to="/teller/requests"
            className={itemClass("/teller/requests")}
            onClick={() => setActivePath("/teller/requests")}
          >
            📥 <span className="label">Transaction Requests</span>
          </NavLink>

          <NavLink
            to="/teller/transactions"
            className={itemClass("/teller/transactions")}
            onClick={() => setActivePath("/teller/transactions")}
          >
            📊 <span className="label">Transactions</span>
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
            <button
              className="notif-btn"
              onClick={() => navigate("/notifications")}
            >
              🔔
            </button>
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
