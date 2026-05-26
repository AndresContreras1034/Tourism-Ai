import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import PlanCard from "../../components/marketplace/PlanCard";

import { AuthContext } from "../../context/AuthContext";

// =====================================================
// 🔌 API CALL
// =====================================================
const plansApi = (token) => ({
  async getRecommendations(filters) {
    const res = await fetch(
      "http://localhost:3000/api/ai/recommendations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Backend error");
    }

    return data;
  },
});

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, token, setUser } = useContext(AuthContext);

  const [filters, setFilters]               = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [bestMatch, setBestMatch]           = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  // =====================================================
  // 📦 LOAD FILTERS
  // =====================================================
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    } else {
      const cached = localStorage.getItem("userProfile");
      setFilters(cached ? JSON.parse(cached) : {});
    }
  }, [location.state]);

  // =====================================================
  // 🚨 CHECK VISUAL
  // =====================================================
  const isOutOfTokens = user?.tokens !== undefined && user?.tokens <= 0;

  // =====================================================
  // 🚀 GENERAR
  // =====================================================
  const handleGenerate = async () => {
    try {
      if (!token) {
        setError("No estás autenticado");
        return;
      }

      if (isOutOfTokens) {
        navigate("/payment");   // ✅ sin "s"
        return;
      }

      setLoading(true);
      setError(null);

      const api  = plansApi(token);
      const data = await api.getRecommendations(filters);

      setRecommendations(data?.data?.recommendations || []);
      setBestMatch(data?.data?.bestMatch || null);

      // =================================================
      // 💰 ACTUALIZAR TOKENS
      // =================================================
      if (data?.remainingTokens !== undefined) {
        const newTokens = data.remainingTokens;

        setUser((prev) => ({
          ...prev,
          tokens: newTokens,
        }));

        // 🔥 REDIRECT SOLO AQUÍ
        if (newTokens <= 0) {
          navigate("/payment", { replace: true });  // ✅ sin "s"
        }
      }

    } catch (err) {
      setError(err.message || "No se pudieron generar recomendaciones");
      setRecommendations([]);
      setBestMatch(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 🧭 NAV
  // =====================================================
  const goToPlan = (plan) => {
    navigate(`/plans/${plan.plan_turistico_bogota}`, {
      state: { plan },
    });
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
              <p>Genera recomendaciones personalizadas con IA</p>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading || !token}
            >
              {loading ? "Generando..." : "✨ Generar recomendaciones"}
            </button>

            {loading ? (
              <div className="hero-skeleton" />
            ) : bestMatch ? (
              <div className="hero-card" onClick={() => goToPlan(bestMatch)}>
                <PlanCard plan={bestMatch} highlight />
              </div>
            ) : (
              <div className="empty-state">
                {error || "Aún no has generado recomendaciones"}
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
                recommendations.map((plan, i) => (
                  <div
                    key={plan.plan_turistico_bogota || i}
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