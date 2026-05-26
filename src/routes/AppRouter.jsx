import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ResultsPage from "../pages/Results/ResultsPage";
import PlanDetail from "../pages/Plan/PlanDetail";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";
import Onboarding from "../pages/Onboarding/Onboarding";
// MFA
import MfaQrModal from "../components/mfa/MfaQrModal";
import MfaSetup from "../components/mfa/MfaSetup";
import MfaVerify from "../components/mfa/MfaVerify";
// PAYMENTS
import PaymentPage from "../pages/Payments/Payments";
import ScrollToTop from "../utils/ScrollToTop";
import { AuthContext } from "../context/AuthContext";

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  const [mfaState, setMfaState] = useState({
    qr: false,
    setup: false,
    verify: false,
    userId: null,
  });

  const openQr     = (userId) => setMfaState({ qr: true,  setup: false, verify: false, userId });
  const openSetup  = (userId) => setMfaState({ qr: false, setup: true,  verify: false, userId });
  const openVerify = (userId) => setMfaState({ qr: false, setup: false, verify: true,  userId });
  const closeAll   = ()       => setMfaState({ qr: false, setup: false, verify: false, userId: null });

  const tokens = user?.tokens ?? null;

  useEffect(() => {
    if (
      tokens !== null &&
      tokens <= 0 &&
      window.location.pathname !== "/payment"
    ) {
      window.location.replace("/payment");
    }
  }, [tokens]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login"    element={<Login openMfaVerify={openVerify} />} />
        <Route path="/register" element={<Register openMfaQr={openQr} />} />

        {/* ONBOARDING 🔥 pasa openQr como onComplete */}
        <Route
          path="/onboarding"
          element={
            <Onboarding onComplete={() => openQr(user?.id)} />
          }
        />

        {/* CHAT */}
        <Route path="/chat" element={<Chat />} />

        {/* CORE */}
        <Route path="/plans"     element={<ResultsPage />} />
        <Route path="/plans/:id" element={<PlanDetail />} />
        <Route path="/profile"   element={<Profile />} />

        {/* 💳 PAYMENT */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* REDIRECTS */}
        <Route path="/results" element={<Navigate to="/plans" replace />} />
        <Route path="*"        element={<Navigate to="/plans" replace />} />
      </Routes>

      {/* MFA MODALS */}
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