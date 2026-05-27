import "./StatCard.css";

export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value ?? "—"}</span>
        {sub && <span className="stat-card__sub">{sub}</span>}
      </div>
    </div>
  );
}