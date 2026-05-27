import { useEffect, useState } from "react";
import { getSales } from "../../../services/admin.service.js";
import StatCard from "../../../components/admin/StatCard.jsx";

export default function SalesSection() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSales(30).then((r) => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <p className="admin-loading">Cargando ventas...</p>;

  const { kpis, top_plan, revenue_over_time } = data;

  return (
    <div className="admin-section">
      <h2>💰 Panel de Ventas</h2>

      <div className="admin-grid-4">
        <StatCard icon="💰" label="Ingresos totales"   value={`$${Number(kpis.total_revenue).toFixed(2)}`} />
        <StatCard icon="📦" label="Total compras"       value={kpis.total_orders} />
        <StatCard icon="🧍" label="Clientes únicos"     value={kpis.unique_customers} />
        <StatCard icon="📈" label="ARPU"                value={`$${kpis.arpu}`} />
      </div>

      {top_plan && (
        <div className="admin-highlight">
          🔥 Plan más vendido: <strong>{top_plan.plan_name}</strong> — {top_plan.sales} ventas
        </div>
      )}

      <div className="admin-chart-placeholder">
        <h3>📈 Ingresos en el tiempo (últimos 30 días)</h3>
        {revenue_over_time.length === 0
          ? <p className="admin-empty">Sin datos aún</p>
          : (
            <ul className="admin-timeline">
              {revenue_over_time.map((r) => (
                <li key={r.date}>
                  {new Date(r.date).toLocaleDateString("es-CO")} — <strong>${Number(r.revenue).toFixed(2)}</strong> ({r.orders} órdenes)
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  );
}