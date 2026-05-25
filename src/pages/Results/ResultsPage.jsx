import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import PlanCard from "../../components/marketplace/PlanCard";

// 🔌 API CONTRACT (sin mock)
const plansApi = {
  async getRecommendations(filters) {
    throw new Error("Backend not connected yet");
  }
};

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [bestMatch, setBestMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    } else {
      setFilters({});
    }
  }, [location.state]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await plansApi.getRecommendations(filters);

        // backend luego decidirá esto
        setRecommendations(data?.recommendations || []);
        setBestMatch(data?.bestMatch || null);
      } catch (err) {
        setError("No se pudieron cargar recomendaciones");
        setRecommendations([]);
        setBestMatch(null);
      } finally {
        setLoading(false);
      }
    };

    if (filters !== null) {
      loadRecommendations();
    }
  }, [filters]);

  const goToPlan = (plan) => {
    navigate(`/plans/${plan.id}`);
  };

  return (
    <>
      <Navbar />

      <div className="results-page">
        <div className="results-container">

          {/* HERO */}
          <section className="results-hero">
            <div className="hero-title">
              <h2>Tu plan perfecto</h2>
              <p>Resultados basados en tus preferencias</p>
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
                {error || "No encontramos un match aún"}
              </div>
            )}
          </section>

          {/* LISTA */}
          <section className="results-section">

            <div className="section-header">
              <h3>Explora más opciones</h3>
            </div>

            <div className="results-grid">

              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-skeleton" />
                ))
              ) : recommendations.length > 0 ? (
                recommendations.map((plan) => (
                  <div
                    key={plan.id}
                    className="result-wrapper"
                    onClick={() => goToPlan(plan)}
                  >
                    <PlanCard plan={plan} />
                  </div>
                ))
              ) : (
                <div className="empty-state full">
                  No hay planes disponibles
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