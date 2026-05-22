import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { FiZap } from "react-icons/fi";
import "./Hero.css";

const MESSAGES = [
  "¿Sin plan hoy? Yo lo resuelvo 😏",
  "En segundos tienes algo brutal 🔥",
  "Dime qué te gusta y te sorprendo 👀",
  "Menos buscar, más disfrutar 🎉",
  "Tu plan perfecto está a un click ⚡",
];

const TRUST = [
  "Resultados en segundos ⚡",
  "Recomendaciones reales ⭐",
  "Experiencias hechas para ti 🎯",
];

export default function Hero() {
  const navigate = useNavigate();

  const [msgIndex, setMsgIndex] = useState(0);
  const [trustIndex, setTrustIndex] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => {
      setMsgIndex((p) => (p + 1) % MESSAGES.length);
    }, 4200);

    const t2 = setInterval(() => {
      setTrustIndex((p) => (p + 1) % TRUST.length);
    }, 3500);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  const goChat = () => {
    navigate("/chat?start=true");
  };

  return (
    <section className="hero">

      {/* fondo */}
      <div className="hero__bg" />
      <div className="hero__overlay" />

      <div className="hero__container">

        {/* izquierda */}
        <div className="hero__left">

          <h1 className="hero__title">
            Encuentra el <span>plan perfecto</span><br />
            en segundos
          </h1>

          <p className="hero__subtitle">
            Habla con claudIA y descubre qué hacer según tu estilo,
            tiempo y presupuesto.
          </p>

          <button className="hero__cta" onClick={goChat}>
            <FiZap />
            claudiA Recomienda
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={trustIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="hero__trust"
            >
              {TRUST[trustIndex]}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* derecha (IA floating bubble) */}
        <div className="hero__right">

          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.5 }}
              className={clsx("hero__bubble")}
            >
              {MESSAGES[msgIndex]}
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}