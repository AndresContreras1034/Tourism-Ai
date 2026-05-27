import "./AdminNavbar.css";

const SECTIONS = [
  { key: "overview",  label: "Overview",  icon: "🏠" },
  { key: "sales",     label: "Ventas",    icon: "💰" },
  { key: "catalog",   label: "Catálogo",  icon: "📦" },
  { key: "map",       label: "Mapa",      icon: "🌍" },
  { key: "product",   label: "Producto",  icon: "🧳" },
  { key: "payments",  label: "Pagos",     icon: "💳" },
  { key: "users",     label: "Usuarios",  icon: "👥" },
];

export default function AdminNavbar({ active, onChange }) {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__brand">
        <span>🛡</span> Admin
      </div>
      <ul className="admin-navbar__list">
        {SECTIONS.map((s) => (
          <li
            key={s.key}
            className={`admin-navbar__item ${active === s.key ? "active" : ""}`}
            onClick={() => onChange(s.key)}
          >
            <span>{s.icon}</span> {s.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}