import "./Card.css";

export default function Card({ title, children, icon }) {
  return (
    <div className="ui-card">
      {icon && <div className="ui-card-icon">{icon}</div>}
      {title && <h3 className="ui-card-title">{title}</h3>}
      <div className="ui-card-body">{children}</div>
    </div>
  );
}
