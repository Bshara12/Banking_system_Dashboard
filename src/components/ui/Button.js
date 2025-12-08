import "./Button.css";

export default function Button({
  children,
  onClick,
  type = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
}) {
  return (
    <button
      className={`ui-btn ui-btn-${type} ${fullWidth ? "full" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="ui-btn-loader"></span>
      ) : (
        <>
          {iconLeft && <span className="btn-icon">{iconLeft}</span>}
          {children}
          {iconRight && <span className="btn-icon">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
