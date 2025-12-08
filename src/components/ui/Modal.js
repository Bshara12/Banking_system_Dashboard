import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="ui-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="ui-modal">
        <header className="ui-modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="ui-modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        </header>

        <div className="ui-modal-body">{children}</div>

        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
