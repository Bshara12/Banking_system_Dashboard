import { useEffect, useState } from "react";
import "./SupportDashboard.css";
import { SupportAPI } from "../../api/support.api";
import { useNavigate } from "react-router-dom";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await SupportAPI.getTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const openTickets = tickets.filter(t => t.status === "open").length;
  const readTickets = tickets.filter(t => t.status === "read").length;
  const closedTickets = tickets.filter(t => t.status === "closed").length;

  return (
    <div className="support-dashboard-container">
      <h1 className="support-title">Support Dashboard</h1>

      <div className="support-cards">
        <div className="s-card blue">
          <h3>{openTickets}</h3>
          <p>Open Tickets</p>
        </div>

        <div className="s-card green">
          <h3>{readTickets}</h3>
          <p>Read Tickets</p>
        </div>

        <div className="s-card gray">
          <h3>{closedTickets}</h3>
          <p>Closed Tickets</p>
        </div>
      </div>

      <button className="view-btn" onClick={() => navigate("/support/tickets")}>
        View Tickets →
      </button>
    </div>
  );
}
