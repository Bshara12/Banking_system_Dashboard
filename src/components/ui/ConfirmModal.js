import React from "react";
import "./Modal.css";

export default function ConfirmModal({ open, title, message, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
