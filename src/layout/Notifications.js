import React, { useEffect, useState } from "react";
import { notifications } from "../api/dashboard.api";
import "./Notifications.css";

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب الإشعارات
  async function loadNotifications() {
    try {
      setLoading(true);
      const res = await notifications();
      setData(res.data);
    } catch (e) {
      console.log("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : data.length === 0 ? (
        <div className="empty">No notifications found</div>
      ) : (
        <ul className="notifications-list">
          {data.map((n, index) => (
            <li key={index} className="notification-item">
              <div className="notification-header">
                <span className={`type ${n.type}`}>{n.type}</span>
                <span className="date">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              <div className="notification-content">{n.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
