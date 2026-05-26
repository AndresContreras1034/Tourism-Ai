import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./PlanDetail.css";

import MapView from "../../components/map/MapView";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

// assets
import mapaImg from "../../assets/mapa.png";
import caminarImg from "../../assets/caminar.png";
import uberImg from "../../assets/uber.png";
import bicicletaImg from "../../assets/bicicleta.png";
import busImg from "../../assets/bus.png";
import cafeImg from "../../assets/cafe.png";
import mealImg from "../../assets/meal.png";
import snackImg from "../../assets/snack.png";

const TRANSPORT_ASSETS = {
  caminar:   { img: caminarImg,   title: "Caminar" },
  uber:      { img: uberImg,      title: "Uber" },
  bicicleta: { img: bicicletaImg, title: "Bicicleta" },
  bus:       { img: busImg,       title: "Bus" },
};

const TRANSPORT_FALLBACK = [
  { key: "caminar",   desc: "Ideal para recorridos cortos y disfrutar cada detalle." },
  { key: "uber",      desc: "Cómodo y seguro, perfecto si vas con más gente." },
  { key: "bicicleta", desc: "Rápido y económico por las ciclovías de Bogotá." },
  { key: "bus",       desc: "La opción más económica para toda la ciudad." },
];

const SECURITY_LEVEL_LABEL = {
  low:    "Zona segura",
  medium: "Precaución recomendada",
  high:   "Zona de alto riesgo",
};

const enrichPlan = async (rawPlan) => {
  const res = await fetch("/api/ai/enrich", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: rawPlan }),
  });

  if (!res.ok) throw new Error("Enrichment failed");

  const json = await res.json();
  return json.data;
};

export default function PlanDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const rawPlan = location.state?.plan;

  const [plan, setPlan]               = useState(null);
  const [enriching, setEnriching]     = useState(true);
  const [enrichError, setEnrichError] = useState(false);
  const [showMap, setShowMap]         = useState(false);

  useEffect(() => {
    if (!rawPlan) navigate("/");
  }, []);

  useEffect(() => {
    if (!rawPlan) return;

    const run = async () => {
      try {
        setEnriching(true);
        const enriched = await enrichPlan(rawPlan);
        setPlan(enriched);
      } catch (err) {
        console.warn("⚠️ Enrichment falló, mostrando datos base:", err.message);
        setPlan(rawPlan);
        setEnrichError(true);
      } finally {
        setEnriching(false);
      }
    };

    run();
  }, []);

  if (enriching) {
    return (
      <div className="loading-screen">
        <Navbar />
        <motion.div
          className="loading-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>ClaudIA está preparando tu plan...</h2>
          <p>Analizando clima, seguridad y experiencias 🧠</p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  if (!plan) return null;

  const title     = plan.title || plan.plan_turistico_bogota || "Plan personalizado";
  const locName   = plan.location?.name || plan.plan_turistico_bogota || "Bogotá";
  const transport = plan.transport?.length === 4 ? plan.transport : TRANSPORT_FALLBACK;

  return (
    <div className="plan-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="plan-hero">
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{title}</h1>
          <p className="location">📍 {locName}</p>
          <div className="hero-meta">
            <span className="score">⭐ {plan.score || "N/A"}</span>
            <span className="tag">Experiencia optimizada</span>
          </div>
          <button className="cta-primary">Empezar recorrido</button>
        </motion.div>
      </section>

      {/* ── CLAUDIA ── */}
      <section className="assistant-section">
        <motion.div
          className="assistant-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="assistant-header">
            <div className="assistant-avatar">🤖</div>
            <div>
              <h2>ClaudIA</h2>
              <span className="assistant-badge">Asistente de planificación</span>
            </div>
          </div>

          <p className="assistant-main">
            Información generada por el sistema de recomendaciones.
          </p>

          <div className="assistant-recommendation">
            <p>{plan.ai_context?.summary || "Sin resumen disponible"}</p>
            <p>{plan.ai_context?.local_insight || ""}</p>
          </div>

          <div className="assistant-actions">
            <button>Más económico</button>
            <button>Más rápido</button>
            <button>Más seguro</button>
          </div>
        </motion.div>
      </section>

      {/* ── TRANSPORTE ── */}
      <section className="transport-section">
        <h2>Cómo moverte</h2>
        <div className="transport-grid">
          {transport.map((t, i) => {
            const key   = t.key?.toLowerCase()?.trim();
            const asset = TRANSPORT_ASSETS[key] ?? {};
            return (
              <motion.div
                key={i}
                className="transport-card"
                whileHover={{ scale: 1.05 }}
              >
                <img src={asset.img} alt={asset.title} />
                <h3>{asset.title}</h3>
                <p>{t.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── MAPA ── */}
      <section className="map-section">
        <div className="map-header">
          <div className="map-title">
            <img src={mapaImg} alt="" />
            <h2>Ruta</h2>
          </div>
          <button onClick={() => setShowMap(!showMap)}>
            {showMap ? "Ocultar mapa" : "Ver mapa"}
          </button>
        </div>

        {showMap && (
          <motion.div
            className="map-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MapView
              center={
                plan.location?.coordinates
                  ? {
                      lat: Number(plan.location.coordinates.lat),
                      lng: Number(plan.location.coordinates.lng),
                    }
                  : { lat: 4.711, lng: -74.0721 }
              }
              points={plan.map_points || []}
              route={plan.route || []}
            />
          </motion.div>
        )}
      </section>

      {/* ── EXPERIENCIA ── */}
      <section className="experience-section">
        <h2>Experiencia</h2>
        <p>{plan.experience?.description || "Descripción no disponible"}</p>
        <div className="highlights">
          {(plan.experience?.highlights || []).map((h, i) => (
            <motion.div
              key={i}
              className="highlight-card"
              whileHover={{ scale: 1.05 }}
            >
              ✨ {h}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DÍA ÓPTIMO ── */}
      <section className="optimal-day-section">
        <h2>Día óptimo para ir</h2>
        {plan.optimal_day ? (
          <motion.div
            className="optimal-day-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="optimal-day-header">
              <span className="optimal-day-icon">
                {plan.optimal_day.weather?.icon || "🌤️"}
              </span>
              <div>
                <h3>{plan.optimal_day.date}</h3>
                <span className="optimal-day-condition">
                  {plan.optimal_day.weather?.condition || "Sin clima"}
                </span>
              </div>
            </div>
            <div className="optimal-day-weather">
              <span>
                🌡️ {plan.optimal_day.weather?.temp_min}° –{" "}
                {plan.optimal_day.weather?.temp_max}°C
              </span>
              <span>
                🌧️ {plan.optimal_day.weather?.precip_probability}% lluvia
              </span>
            </div>
            <p className="optimal-day-reason">{plan.optimal_day.reason}</p>
          </motion.div>
        ) : (
          <p className="section-empty">Análisis climático no disponible aún.</p>
        )}
      </section>

      {/* ── SEGURIDAD ── */}
      <section className="security-section">
        <h2>Recomendación de seguridad</h2>
        {plan.security ? (
          <motion.div
            className={`security-card security-${plan.security.level}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="security-header">
              <span className="security-badge">
                {SECURITY_LEVEL_LABEL[plan.security?.level] ?? "Sin datos de seguridad"}
              </span>
            </div>
            <p className="security-recommendation">
              {plan.security.recommendation}
            </p>
            {(plan.security.tips || []).length > 0 && (
              <ul className="security-tips">
                {plan.security.tips.map((tip, i) => (
                  <li key={i}>🛡️ {tip}</li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <p className="section-empty">Evaluación de seguridad no disponible aún.</p>
        )}
      </section>

      {/* ── PRESUPUESTO ── */}
      <section className="budget-section">
        <h2>Presupuesto</h2>
        <div className="budget-summary">
          <h1>
            {plan.budget?.estimated_total != null
              ? `${plan.budget.estimated_total.toLocaleString()} COP`
              : "Estimación no disponible"}
          </h1>
        </div>
        <div className="budget-grid">
          {[
            { img: cafeImg,  title: "Café",   value: plan.budget?.price_range?.coffee },
            { img: mealImg,  title: "Comida", value: plan.budget?.price_range?.meal },
            { img: snackImg, title: "Snacks", value: plan.budget?.price_range?.snack },
          ].map((b, i) => (
            <div key={i} className="budget-card">
              <img src={b.img} alt="" />
              <h3>{b.title}</h3>
              <p>{b.value || "Por definir"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="final-cta">
        <h2>¿Listo?</h2>
        <p>Tu experiencia será optimizada dinámicamente</p>
        <button className="cta-primary">Iniciar</button>
      </section>

      <Footer />
    </div>
  );
}