import { useLocation, useNavigate } from "react-router-dom";
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

export default function PlanDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (location.state?.plan) {
      setPlan(location.state.plan);
    } else {
      navigate("/plans");
    }
  }, [location.state, navigate]);

  if (!plan) {
    return (
      <div className="loading-screen">
        <Navbar />
        <motion.div
          className="loading-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Construyendo tu experiencia...</h2>
          <p>ClaudIA está analizando rutas, clima y seguridad</p>
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
          <h1>{plan.title}</h1>

          <p className="location">
            📍 {plan.location?.name}, {plan.city}
          </p>

          <div className="hero-meta">
            <span className="score">⭐⭐⭐⭐⭐ {plan.score}</span>
            <span className="tag">Optimizado por ClaudIA</span>
          </div>

          <button className="cta-primary">
            Empezar recorrido
          </button>
        </motion.div>
      </section>

      {/* CLAUDIA IA */}
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
                IA de planificación en tiempo real
              </span>
            </div>
          </div>

          <motion.p
            className="assistant-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hola 👋, soy <strong>ClaudIA</strong>. Analicé este plan usando datos
            de movilidad, seguridad y comportamiento de viajeros.
          </motion.p>

          <motion.div
            className="assistant-recommendation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>
              {plan.ai_context?.summary ||
                "Te recomiendo iniciar entre 9:00 y 11:00 AM para evitar congestión y mejorar seguridad."}
            </p>

            <p>
              {plan.ai_context?.local_insight ||
                "Empieza por el Museo del Oro y continúa hacia la Plaza de Bolívar para optimizar el recorrido."}
            </p>
          </motion.div>

          <motion.div
            className="assistant-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button>💸 Más económico</button>
            <button>⚡ Más rápido</button>
            <button>🛡️ Más seguro</button>
          </motion.div>
        </motion.div>
      </section>

      {/* TRANSPORTE */}
      <section className="transport-section">
        <h2>Cómo moverte</h2>

        <div className="transport-grid">
          {[ 
            { img: caminarImg, title: "Caminar", desc: "120 min · Gratis", tag: "Recomendado" },
            { img: uberImg, title: "Uber", desc: "15 min · 8.000 COP", tag: "Más rápido" },
            { img: bicicletaImg, title: "Bicicleta", desc: "25 min · Bajo costo" },
            { img: busImg, title: "Bus", desc: "30 min · Económico" }
          ].map((t, i) => (
            <motion.div
              key={i}
              className="transport-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={t.img} alt="" />
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              {t.tag && <span>{t.tag}</span>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="map-section">
        <div className="map-header">
          <div className="map-title">
            <img src={mapaImg} alt="" />
            <h2>Ruta optimizada</h2>
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
              center={plan.location.coordinates}
              points={plan.map_points}
            />
          </motion.div>
        )}
      </section>

      {/* EXPERIENCIA */}
      <section className="experience-section">
        <h2>Lo que vas a vivir</h2>

        <p>{plan.experience?.description}</p>

        <div className="highlights">
          {plan.experience?.highlights?.map((h, i) => (
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
        <h2>Tu inversión</h2>

        <div className="budget-summary">
          <h1>
            {plan.budget?.estimated_total?.toLocaleString()} COP
          </h1>
          <p>Estimación inteligente basada en tu perfil</p>
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
              <p>{b.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final-cta">
        <h2>¿Listo para comenzar?</h2>
        <p>ClaudIA seguirá optimizando tu experiencia en tiempo real</p>

        <button className="cta-primary">
          Iniciar ahora
        </button>
      </section>

      <Footer />
    </div>
  );
}