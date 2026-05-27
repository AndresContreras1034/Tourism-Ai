import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./RecommendationsSlider.css";

import ReviewModal from "./ReviewModal";
import { getReviews, createReview } from "../../services/reviews.service";

// =========================
// ⭐ Stars Component
// =========================
function Stars({ rating }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
}

// =========================
// 🚀 MAIN COMPONENT
// =========================
export default function RecommendationsSlider() {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // =========================
  // 📥 LOAD REVIEWS FROM DB
  // =========================
  useEffect(() => {
    const loadReviews = async () => {
      try {
        console.log("🟡 [REVIEWS] Fetching from API...");

        setLoading(true);

        const data = await getReviews();

        console.log("🟢 [REVIEWS] RAW RESPONSE:", data);
        console.log("📦 [REVIEWS] TYPE:", typeof data);
        console.log("📊 [REVIEWS] LENGTH:", data?.length);

        setReviews(data || []);

        console.log("✅ [REVIEWS] State updated");
      } catch (err) {
        console.error("🔴 [REVIEWS] ERROR FETCHING:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // =========================
  // 📤 ADD REVIEW (POST DB)
  // =========================
  const handleAddReview = async (newReview) => {
    try {
      console.log("🟡 [CREATE REVIEW] Sending:", newReview);

      const created = await createReview(newReview);

      console.log("🟢 [CREATE REVIEW] Response:", created);

      if (created) {
        setReviews((prev) => {
          const updated = [created, ...prev];
          console.log("📦 [REVIEWS] After insert:", updated);
          return updated;
        });

        setOpen(false);
      }
    } catch (err) {
      console.error("🔴 [CREATE REVIEW] ERROR:", err);
    }
  };

  // 🔥 loop infinito visual
  const loopReviews = [...reviews, ...reviews];

  // =========================
  // 🔍 DEBUG RENDER STATE
  // =========================
  console.log("🧠 [RENDER] loading:", loading);
  console.log("🧠 [RENDER] reviews:", reviews);
  console.log("🧠 [RENDER] loopReviews:", loopReviews);

  return (
    <div className="slider-wrapper">

      {/* =========================
          TITLE
      ========================= */}
      <motion.h2
        className="title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💬 Lo que dicen nuestros viajeros
      </motion.h2>

      {/* =========================
          LOADING STATE
      ========================= */}
      {loading ? (
        <p style={{ textAlign: "center", opacity: 0.6 }}>
          Cargando reseñas...
        </p>
      ) : (
        <div className="carousel">
          <div className="carousel-track">

            {loopReviews.map((r, index) => {
              console.log("🎯 [CARD RENDER]", r);

              return (
                <motion.div
                  className="card"
                  key={`${r.id}-${index}`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >

                  {/* HEADER */}
                  <div className="card-header">
                    <div className="avatar">
                      {r.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="user-info">
                      <h4>
                        {r.flag || "🌍"} {r.name}
                      </h4>
                      <span className="country">{r.country}</span>
                    </div>
                  </div>

                  {/* STARS */}
                  <Stars rating={r.rating} />

                  {/* COMMENT */}
                  <p className="comment">“{r.comment}”</p>
                </motion.div>
              );
            })}

          </div>
        </div>
      )}

      {/* =========================
          BUTTON
      ========================= */}
      <motion.button
        className="add-btn"
        onClick={() => {
          console.log("🟣 Open modal");
          setOpen(true);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ✨ Añadir reseña
      </motion.button>

      {/* =========================
          MODAL
      ========================= */}
      <ReviewModal
        isOpen={open}
        onClose={() => {
          console.log("🔵 Close modal");
          setOpen(false);
        }}
        onSubmit={handleAddReview}
      />

    </div>
  );
}