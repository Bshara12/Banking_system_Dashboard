import "./Input.css";

export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
  type = "text",
  icon,
}) {
  return (
    <div className="ui-input-group">
      {label && <label className="ui-input-label">{label}</label>}

      <div className={`ui-input-wrapper ${error ? "error" : ""}`}>
        {icon && <span className="ui-input-icon">{icon}</span>}

        <input
          type={type}
          value={value}
          onChange={onChange}
          className="ui-input"
          placeholder={placeholder}
        />
      </div>

      {error && <div className="ui-input-error">{error}</div>}
    </div>
  );
}
