import "./Features.css";

// 🖼️ Assets (branding real)
import facil from "../../assets/facil.png";
import presupuesto from "../../assets/presupuesto.png";
import mapa from "../../assets/mapa.png";
import inteligente from "../../assets/inteligente.png";

// 📦 DATA (100% separada de UI)
const FEATURES_DATA = [
  {
    id: "ai",
    image: inteligente,
    title: "IA que entiende tus planes",
    description:
      "Recomendaciones personalizadas basadas en tus gustos, presupuesto y tiempo disponible.",
  },
  {
    id: "map",
    image: mapa,
    title: "Explora en un mapa inteligente",
    description:
      "Visualiza experiencias, rutas y lugares cerca de ti con información en tiempo real.",
  },
  {
    id: "budget",
    image: presupuesto,
    title: "Planes según tu presupuesto",
    description:
      "Filtra opciones económicas o premium sin perder tiempo buscando en múltiples apps.",
  },
  {
    id: "fast",
    image: facil,
    title: "Encuentra planes en segundos",
    description:
      "Menos búsqueda, más acción. Decide qué hacer hoy en cuestión de segundos.",
  },
];

// 🧩 COMPONENTE CARD (limpio y reusable)
function FeatureCard({ image, title, description }) {
  return (
    <article className="feature-card">
      <div className="feature-card-image">
        <img src={image} alt={title} loading="lazy" />
      </div>

      <div className="feature-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

// 🚀 COMPONENTE PRINCIPAL
export default function Features() {
  return (
    <section className="features-section">

      {/* HEADER COMERCIAL */}
      <header className="features-header">
        <h2>Una nueva forma de descubrir planes</h2>
        <p>
          Tecnología + turismo + IA para que nunca más pierdas tiempo decidiendo qué hacer.
        </p>
      </header>

      {/* GRID */}
      <div className="features-grid">
        {FEATURES_DATA.map((feature) => (
          <FeatureCard
            key={feature.id}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

    </section>
  );
}