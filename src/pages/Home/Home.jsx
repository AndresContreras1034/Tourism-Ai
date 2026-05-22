import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import React from "react";

import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import Features from "../../components/features/Features";
import Footer from "../../components/footer/Footer";
import RecommendationsSlider from "../../components/recommendations/RecommendationsSlider";
import SeguridadDashboard from "../../components/dashboard/SeguridadDashboard";

export default function Home() {
  const [searchParams, setSearchParams] = useState(null);
  const [user, setUser] = useState(null);

  const location = useLocation();

  // 🔥 scroll al hero
  useEffect(() => {
    const hero = document.querySelector(".hero");

    if (!hero) return;

    if (location.state?.fromChat) {
      hero.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // 🔍 search handler
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    console.log("Búsqueda:", params);
  }, []);

  // 🔐 auth mock
  const handleLogin = () => console.log("login");
  const handleRegister = () => console.log("register");
  const handleLogout = () => setUser(null);

  return (
    <div className="home">

      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      {/* MAIN */}
      <main className="home__main">

        {/* HERO */}
        <Hero onSearch={handleSearch} />

        {/* DASHBOARD */}
        <SeguridadDashboard />

        {/* RECOMMENDATIONS */}
        {/*<ErrorBoundary fallback={<div style={{ color: "white" }}>Recomendaciones no disponibles</div>}>
          <RecommendationsSlider />
        </ErrorBoundary>*/}

        {/* FEATURES */}
        <Features />

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

/* =========================
   🔥 ERROR BOUNDARY SIMPLE
========================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}