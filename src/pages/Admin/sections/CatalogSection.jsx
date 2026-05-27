import { useEffect, useState } from "react";
import { getCatalog } from "../../../services/admin.service.js";

export default function CatalogSection() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalog().then((r) => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <p className="admin-loading">Cargando catálogo...</p>;

  return (
    <div className="admin-section">
      <h2>📦 Catálogo de Planes</h2>

      {data.length === 0
        ? <p className="admin-empty">Sin ventas registradas aún</p>
        : (
          <div className="admin-catalog">
            {data.map((plan) => (
              <div key={plan.plan_key} className="admin-catalog__row">
                <span className="admin-catalog__name">{plan.plan_name || plan.plan_key}</span>
                <div className="admin-catalog__bar-wrap">
                  <div
                    className="admin-catalog__bar"
                    style={{ width: `${Math.min((plan.total_sales / Math.max(...data.map(p => p.total_sales))) * 100, 100)}%` }}
                  />
                </div>
                <span className="admin-catalog__sales">{plan.total_sales} ventas</span>
                <span className="admin-catalog__revenue">${Number(plan.total_revenue).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}