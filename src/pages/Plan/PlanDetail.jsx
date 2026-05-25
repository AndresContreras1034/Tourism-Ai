import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

// 🔌 API PLACEHOLDER (SIN MOCK, SOLO CONTRATO)
const plansApi = {
  async getById(id) {
    throw new Error("Backend not connected yet");
  }
};

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await plansApi.getById(id);
        setPlan(data);
      } catch (err) {
        setError("Plan no disponible en este momento");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Navbar />
        <motion.div
          className="loading-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Construyendo tu experiencia...</h2>
          <p>ClaudIA está preparando tu ruta</p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="loading-screen">
        <Navbar />
        <motion.div
          className="loading-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>⚠️ No se pudo cargar el plan</h2>
          <p>{error}</p>

          <button onClick={() => navigate("/plans")}>
            Volver
          </button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="plan-page">
      <Navbar />

      {/* HERO */}
      <section className="plan-hero">
        <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{plan.title || "Plan personalizado"}</h1>

          <p className="location">
            📍 {plan.location?.name || "Ubicación no disponible"}
          </p>

          <div className="hero-meta">
            <span className="score">
              ⭐ {plan.score || "N/A"}
            </span>
            <span className="tag">
              Experiencia optimizada
            </span>
          </div>

          <button className="cta-primary">
            Empezar recorrido
          </button>
        </motion.div>
      </section>

      {/* IA SECTION (SIN LOGICA MOCK) */}
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
              <span className="assistant-badge">
                Asistente de planificación
              </span>
            </div>
          </div>

          <p className="assistant-main">
            Información generada por el sistema de recomendaciones.
          </p>

          <div className="assistant-recommendation">
            <p>
              {plan.ai_context?.summary ||
                "Puedes iniciar tu recorrido en horario flexible según disponibilidad."}
            </p>

            <p>
              {plan.ai_context?.local_insight ||
                "Puedes comer acá: restaurantes locales cercanos al área del plan."}
            </p>
          </div>

          <div className="assistant-actions">
            <button>Más económico</button>
            <button>Más rápido</button>
            <button>Más seguro</button>
          </div>
        </motion.div>
      </section>

      {/* TRANSPORTE */}
      <section className="transport-section">
        <h2>Cómo moverte</h2>

        <div className="transport-grid">
          {[
            { img: caminarImg, title: "Caminar", desc: "Opcional" },
            { img: uberImg, title: "Uber", desc: "Disponible" },
            { img: bicicletaImg, title: "Bicicleta", desc: "Opcional" },
            { img: busImg, title: "Bus", desc: "Disponible" }
          ].map((t, i) => (
            <motion.div
              key={i}
              className="transport-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={t.img} alt="" />
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAPA */}
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
              center={plan.location?.coordinates}
              points={plan.map_points || []}
            />
          </motion.div>
        )}
      </section>

      {/* EXPERIENCIA */}
      <section className="experience-section">
        <h2>Experiencia</h2>

        <p>
          {plan.experience?.description ||
            "Explora una experiencia diseñada para ti."}
        </p>

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

      {/* PRESUPUESTO */}
      <section className="budget-section">
        <h2>Presupuesto</h2>

        <div className="budget-summary">
          <h1>
            {plan.budget?.estimated_total
              ? `${plan.budget.estimated_total} COP`
              : "Estimación no disponible"}
          </h1>
        </div>

        <div className="budget-grid">
          {[
            { img: cafeImg, title: "Café", value: plan.budget?.price_range?.coffee },
            { img: mealImg, title: "Comida", value: plan.budget?.price_range?.meal },
            { img: snackImg, title: "Snacks", value: plan.budget?.price_range?.snack }
          ].map((b, i) => (
            <div key={i} className="budget-card">
              <img src={b.img} alt="" />
              <h3>{b.title}</h3>
              <p>{b.value || "Por definir"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <h2>¿Listo?</h2>
        <p>Tu experiencia será optimizada dinámicamente</p>

        <button className="cta-primary">
          Iniciar
        </button>
      </section>

      <Footer />
    </div>
  );
}