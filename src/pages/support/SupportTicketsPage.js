import { useEffect, useState } from "react";
import "./support.css";
import { SupportAPI } from "../../api/support.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const res = await SupportAPI.getTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    }
  }

  const filtered = tickets.filter((t) => {
    const matchesText = t.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "all" ? true : t.status === filter;

    return matchesText && matchesFilter;
  });

  return (
    <div className="support-container">
      <div className="support-header">
        <h2>Support Tickets</h2>

        <div className="support-controls">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            {/* <option value="open">Open</option> */}
            <option value="read">Read</option>
            <option value="sended">Sent</option>
          </select>
        </div>
      </div>

      <div className="tickets-list">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="ticket-card"
            onClick={() => navigate(`/support/tickets/${t.id}`)}
          >
            <h3>{t.title}</h3>
            <p>{t.message}</p>

            <div className="ticket-info">
              <span className={`status ${t.status}`}>{t.status}</span>
              <span>{t.created_at.substring(0, 10)}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p className="empty-msg">No tickets found</p>}
      </div>
    </div>
  );
}
