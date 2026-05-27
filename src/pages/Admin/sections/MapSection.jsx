import { useEffect, useState } from "react";
import { getMap } from "../../../services/admin.service.js";

export default function MapSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMap(30).then((r) => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <p className="admin-loading">Cargando mapa...</p>;

  return (
    <div className="admin-section">
      <h2>🌍 Mapa de Usuarios</h2>

      <div className="admin-grid-2">
        <div>
          <h3>📍 Usuarios por ciudad</h3>
          {data.users_by_country.length === 0
            ? <p className="admin-empty">Sin datos</p>
            : (
              <ul className="admin-list">
                {data.users_by_country.map((c) => (
                  <li key={c.country}>
                    <span>{c.country}</span>
                    <strong>{c.users} usuarios</strong>
                  </li>
                ))}
              </ul>
            )
          }
        </div>

        <div>
          <h3>🔥 Destinos más usados</h3>
          {data.top_destinations.length === 0
            ? <p className="admin-empty">Sin planes generados aún</p>
            : (
              <ul className="admin-list">
                {data.top_destinations.map((d) => (
                  <li key={d.destination}>
                    <span>{d.destination}</span>
                    <strong>{d.times_used}x</strong>
                  </li>
                ))}
              </ul>
            )
          }
        </div>
      </div>
    </div>
  );
}