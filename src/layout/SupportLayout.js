import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminLayout.css";
import { useAuth } from "../hooks/useAuth";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function SupportLayout() {
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
        transition={{ duration: 0.3 }}
        className={`sidebar ${!open ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{open ? "Support" : "SP"}</h2>

          <motion.button
            className="toggle-btn"
            onClick={() => setOpen(!open)}
            animate={{ rotate: open ? 180 : 0 }}
          >
            ➤
          </motion.button>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/support/tickets"
            className={itemClass("/support/tickets")}
            onClick={() => setActivePath("/support/tickets")}
          >
            🎫 <span className="label">Tickets</span>
          </NavLink>
          <NavLink
            to="/support/accounts"
            className={itemClass("/support/accounts")}
            onClick={() => setActivePath("/support/accounts")}
          >
            💳 <span className="label">Accounts</span>
          </NavLink>
          <NavLink
            to="/support/transaction"
            end
            className={itemClass("/support/transaction")}
            onClick={() => setActivePath("/support/transaction")}
          >
            📊 <span className="label">transaction</span>
          </NavLink>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Hello, {user?.name}</h1>
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

        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
