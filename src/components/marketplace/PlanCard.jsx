import "./PlanCard.css";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ plan, highlight = false }) {
  const navigate = useNavigate();

  if (!plan) return null;

  const handleClick = () => {
    navigate(`/plans/${plan.id}`, {
      state: { plan }
    });
  };

  return (
    <div
      className={`plan-card ${highlight ? "highlight" : ""}`}
      onClick={handleClick}
    >

      {/* =========================
          🧠 HEADER (GANCHO)
      ========================= */}
      <div className="plan-card-header">
        <h3>{plan.title}</h3>

        {plan.score !== undefined && (
          <div className="score-badge">
            ⭐ {plan.score}
          </div>
        )}
      </div>

      {/* =========================
          📍 LOCATION
      ========================= */}
      <p className="location">
        📍 {plan.location?.name}, {plan.city}
      </p>

      {/* =========================
          🧠 AI SHORT INSIGHT (NUEVO)
      ========================= */}
      {plan.ai_context?.summary && (
        <p className="ai-preview">
          {plan.ai_context.summary}
        </p>
      )}

      {/* =========================
          ✨ EXPERIENCE (HOOK)
      ========================= */}
      <p className="description">
        {plan.experience?.description}
      </p>

      {/* =========================
          ✨ HIGHLIGHTS (VISUAL KEY SELL)
      ========================= */}
      <div className="highlights">
        {plan.experience?.highlights?.slice(0, 2).map((h, i) => (
          <span key={i} className="highlight-item">
            ✨ {h}
          </span>
        ))}
      </div>

      {/* =========================
          💰 BUDGET (DECISION FACTOR)
      ========================= */}
      <div className="budget">
        💰 ~ {plan.budget?.estimated_total?.toLocaleString()} COP
      </div>

      {/* =========================
          ⚠️ FLAGS (SOFT WARNING)
      ========================= */}
      {plan.flags?.length > 0 && (
        <div className="flags">
          <span className={`flag ${plan.flags[0].type}`}>
            {plan.flags[0].message}
          </span>
        </div>
      )}

      {/* =========================
          🧭 META INFO (LIGHT)
      ========================= */}
      <div className="meta">
        <span>⏱ {plan.routes?.[0]?.duration_min} min</span>
        <span>📊 {plan.safety?.level}</span>
      </div>

    </div>
  );
}