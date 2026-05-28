import { useEffect, useState } from "react";
import { getProduct } from "../../../services/admin.service.js";
import StatCard from "../../../components/admin/StatCard.jsx";

export default function ProductSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(30).then((r) => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <p className="admin-loading">Cargando producto...</p>;

  const { stats } = data;

  return (
    <div className="admin-section">
      <h2>🧳 Producto Turístico</h2>

      <div className="admin-grid-4">
        <StatCard icon="✈️" label="Itinerarios generados" value={stats.total_plans} />
        <StatCard icon="🤖" label="Generados por IA"      value={stats.by_source.find(s => s.source === "ai")?.count ?? 0} />
        <StatCard icon="✏️" label="Manuales"              value={stats.by_source.find(s => s.source === "manual")?.count ?? 0} />
        <StatCard icon="📊" label="Planes por usuario"    value={stats.avg_plans_per_user ?? "—"} />
        <StatCard icon="🪙" label="Tokens usados (IA)"    value={stats.total_tokens ?? 0} />
      </div>

      <h3>🏙 Destinos más usados</h3>
      {stats.top_destinations.length === 0
        ? <p className="admin-empty">Sin datos aún</p>
        : (
          <ul className="admin-list">
            {stats.top_destinations.map((d) => (
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