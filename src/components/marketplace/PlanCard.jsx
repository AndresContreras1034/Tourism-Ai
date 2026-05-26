import "./PlanCard.css";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ plan, highlight = false }) {
  const navigate = useNavigate();

  if (!plan) return null;

  const handleClick = () => {
    navigate("/plan-detail", {
      state: { plan },
    });
  };

  return (
    <div
      className={`plan-card ${highlight ? "highlight" : ""}`}
      onClick={handleClick}
    >
      {/* HEADER */}
      <div className="plan-card-header">
        <h3>
          {plan.plan_turistico_bogota || plan.title || "Plan sin título"}
        </h3>

        {plan.score !== undefined && (
          <div className="score-badge">⭐ {plan.score}</div>
        )}
      </div>

      {/* CONTEXTO */}
      <p className="location">
        🎯 {plan.tipo_viaje || "N/A"} · 👥 {plan.compania || "N/A"}
      </p>

      {/* BUDGET */}
      <div className="budget">
        💰 {plan.presupuesto_cop?.toUpperCase?.() || "SIN PRESUPUESTO"}
      </div>

      {/* CLIMA + DURACIÓN */}
      <div className="meta">
        <span>🌤 {plan.clima_preferido || "N/A"}</span>
        <span>⏱ {plan.duracion || "N/A"}</span>
      </div>
    </div>
  );
}