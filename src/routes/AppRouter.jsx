import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import ResultsPage from "../pages/Results/ResultsPage";
import PlanDetail from "../pages/Plan/PlanDetail";

import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";

// 🔥 ONBOARDING
import Onboarding from "../pages/Onboarding/Onboarding";

// 🔐 MFA COMPONENTS
import MfaQrModal from "../components/mfa/MfaQrModal";
import MfaSetup from "../components/mfa/MfaSetup";
import MfaVerify from "../components/mfa/MfaVerify";

// 🔥 UTIL
import ScrollToTop from "../utils/ScrollToTop";

export default function AppRouter() {
  const [mfaState, setMfaState] = useState({
    qr: false,
    setup: false,
    verify: false,
    userId: null,
  });

  const openQr = (userId) =>
    setMfaState({ qr: true, setup: false, verify: false, userId });

  const openSetup = (userId) =>
    setMfaState({ qr: false, setup: true, verify: false, userId });

  const openVerify = (userId) =>
    setMfaState({ qr: false, setup: false, verify: true, userId });

  const closeAll = () =>
    setMfaState({ qr: false, setup: false, verify: false, userId: null });

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* =========================
          🌍 ROUTES PRINCIPALES
      ========================= */}
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login openMfaVerify={openVerify} />}
        />
        <Route
          path="/register"
          element={<Register openMfaQr={openQr} />}
        />

        {/* ONBOARDING */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* IA CHAT */}
        <Route path="/chat" element={<Chat />} />

        {/* =========================
            🧠 CORE PRODUCT ROUTES
        ========================= */}

        {/* RESULTS (MAIN FEED) */}
        <Route path="/plans" element={<ResultsPage />} />

        {/* PLAN DETAIL */}
        <Route path="/plans/:id" element={<PlanDetail />} />

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* =========================
            🔁 REDIRECTS LIMPIOS
        ========================= */}

        {/* legacy results → plans */}
        <Route path="/results" element={<Navigate to="/plans" replace />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* =========================
          🔐 MFA MODALS
      ========================= */}
      {mfaState.qr && (
        <MfaQrModal
          isOpen={mfaState.qr}
          userId={mfaState.userId}
          onClose={closeAll}
          onNext={() => openSetup(mfaState.userId)}
        />
      )}

      {mfaState.setup && (
        <MfaSetup
          isOpen={mfaState.setup}
          userId={mfaState.userId}
          onClose={closeAll}
          onNext={() => openVerify(mfaState.userId)}
        />
      )}

      {mfaState.verify && (
        <MfaVerify
          isOpen={mfaState.verify}
          userId={mfaState.userId}
          onClose={closeAll}
        />
      )}

    </BrowserRouter>
  );
}