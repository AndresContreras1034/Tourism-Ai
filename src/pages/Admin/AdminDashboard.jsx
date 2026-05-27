import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import AdminNavbar     from "../../components/admin/AdminNavbar.jsx";
import SalesSection    from "./sections/SalesSection.jsx";
import CatalogSection  from "./sections/CatalogSection.jsx";
import MapSection      from "./sections/MapSection.jsx";
import ProductSection  from "./sections/ProductSection.jsx";
import PaymentsSection from "./sections/PaymentsSection.jsx";
import UsersSection    from "./sections/UsersSection.jsx"; // 👈 nuevo
import "./AdminDashboard.css";

const SECTIONS = {
overview: () => (
  <div className="admin-section">
    <h2>🏠 Overview</h2>

    <div className="admin-hero">
      <div className="admin-hero-title">
        Tourism AI Control Room
      </div>

      <div className="admin-hero-subtitle">
        Sistema activo · Operaciones en tiempo real · Observando la demanda global
      </div>

      <div className="admin-hero-text">
        <p>
          No estás viendo un dashboard. Estás viendo el pulso de una plataforma viva.
          Cada métrica aquí representa decisiones humanas convertidas en datos.
        </p>

        <p>
          Reservas que nacen en segundos, pagos que cruzan fronteras, usuarios que
          confían en el sistema para planear su próximo destino.
        </p>

        <p>
          Este panel no solo muestra lo que pasó. Te deja entender lo que está
          pasando ahora mismo dentro del ecosistema.
        </p>
      </div>

      <div className="admin-hero-footer">
        Selecciona una sección del menú izquierdo para explorar capas más profundas del sistema.
      </div>
    </div>

    <p style={{ color: "#aaa" }}>
      Accede a métricas, usuarios, pagos y catálogo en tiempo real.
    </p>
  </div>
),
  sales:    SalesSection,
  catalog:  CatalogSection,
  map:      MapSection,
  product:  ProductSection,
  payments: PaymentsSection,
  users:    UsersSection, // 👈 nuevo
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState("overview");

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "superadmin") return <Navigate to="/" replace />;

  const Section = SECTIONS[active] ?? SECTIONS.overview;

  return (
    <div className="admin-layout">
      <AdminNavbar active={active} onChange={setActive} />
      <main className="admin-main">
        <Section />
      </main>
    </div>
  );
}