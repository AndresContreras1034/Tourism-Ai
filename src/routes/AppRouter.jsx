import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ResultsPage from "../pages/Results/ResultsPage";
import PlanDetail from "../pages/Plan/PlanDetail";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Chat/Chat";
import Onboarding from "../pages/Onboarding/Onboarding";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";

// MFA
import MfaQrModal from "../components/mfa/MfaQrModal";
import MfaSetup from "../components/mfa/MfaSetup";
import MfaVerify from "../components/mfa/MfaVerify";
// PAYMENTS
import PaymentPage from "../pages/Payments/Payments";
import ScrollToTop from "../utils/ScrollToTop";
import { AuthContext } from "../context/AuthContext";

/* =========================================================
   🔒 ROLES CON ACCESO A ADMIN
========================================================= */
const ADMIN_ROLES = ["admin", "superadmin"];

/* =========================================================
   🔒 GUARD: solo admin / superadmin
========================================================= */
function AdminRoute({ user, loading, children }) {
  if (loading) return null; // espera a que AuthContext inicialice
  if (!user)   return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  if (!ADMIN_ROLES.includes(user.role)) return <Navigate to="/" replace />; // 👈 fix
  return children;
}

/* =========================================================
   🔒 GUARD: usuario autenticado
========================================================= */
function PrivateRoute({ user, loading, children }) {
  if (loading) return null;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

export default function AppRouter() {
  const { user, loading } = useContext(AuthContext);

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

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Onboarding onComplete={() => openQr(user?.id)} />
            </PrivateRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* CORE */}
        <Route path="/plans"     element={<ResultsPage />} />
        <Route path="/plans/:id" element={<PlanDetail />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 💳 PAYMENT */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* 🔒 ADMIN — antes del wildcard */}
        <Route
          path="/admin"
          element={
            <AdminRoute user={user} loading={loading}>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute user={user} loading={loading}>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* REDIRECTS — siempre al final */}
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