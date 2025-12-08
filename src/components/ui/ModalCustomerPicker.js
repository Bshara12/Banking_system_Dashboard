import { useEffect, useState } from "react";
import { customersApi } from "../../api/customers.api";
import "./ModalCustomerPicker.css";

export default function ModalCustomerPicker({ onClose, onSelect }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const res = await customersApi.list();
    setCustomers(res.data);
  }

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Select Customer</h3>

        <input
          className="modal-search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="modal-list">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="modal-item"
              onClick={() => {
                onSelect(c);
                onClose();
              }}
            >
              <strong>{c.name}</strong>
              <span>{c.email}</span>
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
