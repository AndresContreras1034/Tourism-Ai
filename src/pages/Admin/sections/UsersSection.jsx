import { useEffect, useState } from "react";
import { getUsers } from "../../../services/admin.service.js";

const ROLE_COLORS = {
  superadmin: "#f59e0b",
  admin:      "#8b5cf6",
  client:     "#6b7280",
};

export default function UsersSection() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getUsers(page)
      .then((r) => {
        setUsers(r.data?.users ?? []);
        setTotalPages(r.data?.total_pages ?? 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p className="admin-loading">Cargando usuarios...</p>;

  return (
    <div className="admin-section">
      <h2>👥 Usuarios</h2>

      <div className="admin-users__summary">
        <span>{users.length} usuarios en esta página</span>
      </div>

      <div className="admin-users__table-wrap">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Tokens</th>
              <th>Planes</th>
              <th>Órdenes</th>
              <th>Gastado</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name || "—"}</td>
                <td className="admin-users__email">{u.email}</td>
                <td>
                  <span
                    className="admin-users__role"
                    style={{ background: ROLE_COLORS[u.role] ?? "#6b7280" }}
                  >
                    {u.role}
                  </span>
                </td>
                <td>{u.tokens ?? 0}</td>
                <td>{u.total_plans ?? 0}</td>
                <td>{u.total_orders ?? 0}</td>
                <td>${Number(u.total_spent ?? 0).toFixed(2)}</td>
                <td>{new Date(u.created_at).toLocaleDateString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="admin-users__pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}