import { useEffect, useState } from "react";
import { getPayments } from "../../../services/admin.service.js";
import StatCard from "../../../components/admin/StatCard.jsx";

export default function PaymentsSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments(30).then((r) => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <p className="admin-loading">Cargando pagos...</p>;

  const { summary } = data;

  return (
    <div className="admin-section">
      <h2>💳 Pagos Stripe</h2>

      <div className="admin-grid-4">
        <StatCard icon="✅" label="Exitosos"       value={summary.successful} />
        <StatCard icon="❌" label="Fallidos"        value={summary.failed} />
        <StatCard icon="💰" label="Total cobrado"   value={`$${Number(summary.total_collected).toFixed(2)}`} />
        <StatCard icon="📉" label="Tasa de fallo"   value={`${summary.failure_rate_pct ?? 0}%`} />
      </div>

      <h3>🌍 Por ciudad de origen</h3>
      {data.by_country.length === 0
        ? <p className="admin-empty">Sin pagos aún</p>
        : (
          <ul className="admin-list">
            {data.by_country.map((c) => (
              <li key={c.country}>
                <span>{c.country}</span>
                <strong>${Number(c.revenue).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}