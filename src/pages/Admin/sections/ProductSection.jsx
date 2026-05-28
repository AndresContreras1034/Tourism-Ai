import { useEffect, useState } from "react";
import { getProduct } from "../../../services/admin.service.js";
import StatCard from "../../../components/admin/StatCard.jsx";

const MODEL_PRICING = {
  "deepseek-chat":     { label: "DeepSeek V3 (actual)", blended: 0.70 },
  "deepseek-reasoner": { label: "DeepSeek R1",          blended: 1.37 },
  "gpt-4o-mini":       { label: "GPT-4o Mini",          blended: 0.375 },
  "gpt-4o":            { label: "GPT-4o",               blended: 6.25 },
  "claude-haiku-4-5":  { label: "Claude Haiku 4.5",     blended: 2.40 },
  "claude-sonnet-4-5": { label: "Claude Sonnet 4.5",    blended: 9.00 },
  "gemini-2.0-flash":  { label: "Gemini 2.0 Flash",     blended: 0.25 },
};

const AVG_TOKENS_PER_PLAN = 1120;
const CURRENT_MODEL = "deepseek-chat";

const calcCost = (tokens, price) =>
  parseFloat(((tokens / 1_000_000) * price).toFixed(4));

export default function ProductSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(30).then((r) => {
      setData(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="admin-loading">Cargando producto...</p>;

  const { stats } = data;

  // Calcular tokens estimados en el frontend
  const aiPlans     = Number(stats.by_source?.find(s => s.source === "ai")?.count ?? 0);
  const rawTokens   = Number(stats.total_tokens ?? 0);
  const totalTokens = rawTokens <= aiPlans ? aiPlans * AVG_TOKENS_PER_PLAN : rawTokens;
  const isEstimated = rawTokens <= aiPlans;

  const costComparison = Object.entries(MODEL_PRICING)
    .map(([key, m]) => ({
      model:      key,
      label:      m.label,
      cost_usd:   calcCost(totalTokens, m.blended),
      is_current: key === CURRENT_MODEL,
    }))
    .sort((a, b) => a.cost_usd - b.cost_usd);

  const currentCost = costComparison.find(m => m.is_current)?.cost_usd ?? 0;

  return (
    <div className="admin-section">
      <h2>🧳 Producto Turístico</h2>

      <div className="admin-grid-4">
        <StatCard icon="✈️" label="Itinerarios generados"  value={stats.total_plans} />
        <StatCard icon="🤖" label="Generados por IA"       value={aiPlans} />
        <StatCard icon="✏️" label="Manuales"               value={stats.by_source?.find(s => s.source === "manual")?.count ?? 0} />
        <StatCard icon="📊" label="Planes por usuario"     value={stats.avg_plans_per_user ?? "—"} />
        <StatCard
          icon="🪙"
          label={isEstimated ? "Tokens estimados (IA)" : "Tokens reales (IA)"}
          value={`~${totalTokens.toLocaleString()}`}
        />
        <StatCard
          icon="💵"
          label={`Costo total (${MODEL_PRICING[CURRENT_MODEL].label})`}
          value={`$${currentCost.toFixed(4)} USD`}
        />
      </div>

      {isEstimated && (
        <p className="admin-subtitle" style={{ marginBottom: 16 }}>
          ⚠️ Estimado a ~{AVG_TOKENS_PER_PLAN.toLocaleString()} tokens/plan según tu dashboard de DeepSeek.
        </p>
      )}

      <h3>💡 ¿Cuánto costaría con otros modelos?</h3>
      <p className="admin-subtitle">
        Basado en ~{totalTokens.toLocaleString()} tokens ({aiPlans} planes de IA generados).
      </p>
      <ul className="admin-list">
        {costComparison.map((m) => (
          <li key={m.model} style={{ fontWeight: m.is_current ? 600 : 400 }}>
            <span>
              {m.is_current && "✅ "}
              {m.label}
              {m.is_current && " "}
            </span>
            <strong>${m.cost_usd.toFixed(4)} USD</strong>
          </li>
        ))}
      </ul>

      <h3>🏙 Destinos más usados</h3>
      {stats.top_destinations?.length === 0
        ? <p className="admin-empty">Sin datos aún</p>
        : (
          <ul className="admin-list">
            {stats.top_destinations?.map((d) => (
              <li key={d.destination}>
                <span>{d.destination}</span>
                <strong>{d.count}x</strong>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}