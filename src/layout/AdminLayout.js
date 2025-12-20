import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminLayout.css";
import { useAuth } from "../hooks/useAuth";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const navigate = useNavigate();

  // مزامنة الحالة مع المسار الحالي دائماً
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // دالة مساعدة لبناء الكلاس
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
          <h2 className="sidebar-logo">{open ? "Admin Panel" : "AP"}</h2>

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
            to="/admin"
            end
            className={itemClass("/admin")}
            onClick={() => setActivePath("/admin")}
          >
            🏠 <span className="label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/accounts"
            className={itemClass("/admin/accounts")}
            onClick={() => setActivePath("/admin/accounts")}
          >
            💳 <span className="label">Accounts</span>
          </NavLink>

          <NavLink
            to="/admin/transactions"
            className={itemClass("/admin/transactions")}
            onClick={() => setActivePath("/admin/transactions")}
          >
            📊 <span className="label">Transactions</span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={itemClass("/admin/reports")}
            onClick={() => setActivePath("/admin/reports")}
          >
            📄 <span className="label">Reports</span>
          </NavLink>

          <NavLink
            to="/admin/logs"
            className={itemClass("/admin/logs")}
            onClick={() => setActivePath("/admin/logs")}
          >
            📁 <span className="label">Logs</span>
          </NavLink>

          <NavLink
            to="/admin/manager"
            className={itemClass("/admin/manager")}
            onClick={() => setActivePath("/admin/manager")}
          >
            🧑‍💼 <span className="label">Manager</span>
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
