import { useEffect, useState } from "react";
import { fetchAnalyticsSummary } from "../../services/analytics.service";
import UsersChart from "./charts/UsersChart";
import BudgetChart from "./charts/BudgetChart";
import "./AnalyticsDashboard.css";

export default function AnalyticsDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchAnalyticsSummary()
      .then(setData)
      .catch((e) => setError(e?.message ?? "Error desconocido"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="an-dashboard">

      {/* ── Header ── */}
      <header className="an-header">
        <div>
          <h1 className="an-title">
            <span className="an-title--accent">Tourism</span> Analytics
          </h1>
          <p className="an-subtitle">
            Dataset · Bogotá, Colombia
            {data && (
              <span className="an-subtitle--pill">
                {data.kpis.total_registros.toLocaleString("es-CO")} registros
              </span>
            )}
          </p>
        </div>
        <div className="an-header__right">
          <span className="an-badge">🗺️ Bogotá</span>
          {loading && <span className="an-loading-dot" />}
        </div>
      </header>

      {/* ── Error state ── */}
      {error && (
        <div className="an-error">
          <span>⚠️</span>
          <p>No se pudo cargar el dashboard: <strong>{error}</strong></p>
        </div>
      )}



      {/* ── Divider ── */}
      <div className="an-divider">
        <span>Comportamiento de usuarios</span>
      </div>

      {/* ── Users / behavior charts ── */}
      <section className="an-section">
        <UsersChart data={data} />
      </section>

      {/* ── Divider ── */}
      <div className="an-divider">
        <span>Presupuesto · Ratings · Planes</span>
      </div>

      {/* ── Budget / rating charts ── */}
      <section className="an-section">
        <BudgetChart data={data} />
      </section>

    </div>
  );
}