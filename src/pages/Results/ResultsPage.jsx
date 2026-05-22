import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import { useRecommendations } from "../../hooks/useRecommendations";
import PlanCard from "../../components/marketplace/PlanCard";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [tokens] = useState(2);

  const { recommendations, bestMatch, loading } =
    useRecommendations(filters);

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    }
  }, [location.state]);

  const handleLockedAccess = () => {
    navigate("/profile"); // mejor UX que alert
  };

  const goToPlan = (plan) => {
    navigate(`/plans/${plan.id}`, { state: { plan } });
  };

  return (
    <>
      <Navbar />

      <div className="results-page">

        <div className="results-container">

          {/* =========================
              HERO PRINCIPAL
          ========================= */}
          <section className="results-hero">

            <div className="hero-title">
              <h2>Tu plan perfecto</h2>
              <p>
                Hemos analizado tu perfil y esto es lo mejor para ti
              </p>
            </div>

            {loading ? (
              <div className="hero-skeleton">
                <div className="skeleton-card" />
              </div>
            ) : bestMatch ? (
              <div
                className="hero-card"
                onClick={() => goToPlan(bestMatch)}
              >
                <PlanCard plan={bestMatch} highlight />
              </div>
            ) : (
              <div className="empty-state">
                No encontramos un match perfecto aún
              </div>
            )}
          </section>

          {/* =========================
              EXPLORAR MÁS
          ========================= */}
          <section className="results-section">

            <div className="section-header">
              <h3>Explora más opciones</h3>

              <span className={tokens > 0 ? "tokens-ok" : "tokens-off"}>
                🪙 {tokens} tokens
              </span>
            </div>

            {/* LOCKED OVERLAY */}
            {tokens <= 0 && (
              <div className="locked-overlay">
                <div className="locked-box">
                  <h4>Acceso limitado</h4>
                  <p>
                    Necesitas tokens o membresía para ver más planes
                  </p>

                  <button onClick={handleLockedAccess}>
                    Mejorar cuenta
                  </button>
                </div>
              </div>
            )}

            {/* GRID */}
            <div className={`results-grid ${tokens <= 0 ? "blur" : ""}`}>

              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-skeleton" />
                ))
              ) : recommendations?.length > 0 ? (
                recommendations.map((plan) => (
                  <div
                    key={plan.id}
                    className="result-wrapper"
                    onClick={() =>
                      tokens > 0
                        ? goToPlan(plan)
                        : handleLockedAccess()
                    }
                  >
                    <PlanCard plan={plan} />
                  </div>
                ))
              ) : (
                <div className="empty-state full">
                  No hay más planes disponibles
                </div>
              )}

            </div>

          </section>

        </div>
      </div>

      <Footer />
    </>
  );
}