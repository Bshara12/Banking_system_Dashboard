import { useState, useEffect } from "react";
import { ManagerAPI } from "../../api/manager.api";
import "./AddManagerModal.css";

export default function AddManagerModal({ onClose, onCreated }) {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role_id: 2, // Manager role
  });

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const res = await ManagerAPI.getRoles();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    try {
      await ManagerAPI.addManager(form);
      onCreated();
      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <h3>Add Manager</h3>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button className="save-btn" onClick={submit}>Save</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>

      </div>
    </div>
  );
}
