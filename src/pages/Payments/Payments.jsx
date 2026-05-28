import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import "./Payments.css";

import CheckoutForm from "../../components/stripe/CheckoutForm";
import { AuthContext } from "../../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PLANS = [
  {
    key:         "basic",
    label:       "Básico",
    tokens:      10,
    amount:      299,
    price:       "$2.99",
    description: "Perfecto para uso ocasional",
  },
  {
    key:         "pro",
    label:       "Pro",
    tokens:      50,
    amount:      999,
    price:       "$9.99",
    description: "Para usuarios frecuentes",
  },
  {
    key:         "premium",
    label:       "Premium",
    tokens:      9999,
    amount:      1999,
    price:       "$19.99",
    description: "Tokens ilimitados + prioridad",
  },
];

export default function Payments() {
  const navigate = useNavigate();
  const { token, setUser } = useContext(AuthContext);

  const [selectedPlan,  setSelectedPlan]  = useState(null);
  const [clientSecret,  setClientSecret]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [successPlan,   setSuccessPlan]   = useState(null);

  // ======================================================
  // 💳 INICIAR COMPRA — crea el PaymentIntent
  // ======================================================
  const handleBuy = async (plan) => {
    try {
      setLoading(true);
      setError(null);
const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-intent`, {
              method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planKey: plan.key }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error creando el pago");
      }

      setClientSecret(data.data.clientSecret);
      setSelectedPlan(plan);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ✅ PAGO EXITOSO
  // ======================================================
  const handleSuccess = (plan) => {
    // Actualizar tokens en contexto optimistamente
    const added = plan.tokens === 9999 ? 9999 : plan.tokens;
    setUser((prev) => ({ ...prev, tokens: (prev.tokens || 0) + added }));

    setSuccessPlan(plan);
    setClientSecret(null);
    setSelectedPlan(null);
  };

  // ======================================================
  // ❌ CANCELAR CHECKOUT
  // ======================================================
  const handleCancel = () => {
    setClientSecret(null);
    setSelectedPlan(null);
    setError(null);
  };

  // ======================================================
  // 🎉 PANTALLA DE ÉXITO
  // ======================================================
  if (successPlan) {
    return (
      <div className="payments-page">
        <motion.div
          className="success-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="success-icon">🎉</div>
          <h2>¡Pago exitoso!</h2>
          <p>
            Recibiste{" "}
            <strong>
              {successPlan.tokens === 9999 ? "∞" : successPlan.tokens} tokens
            </strong>
          </p>
          <button
            className="buy-btn"
            onClick={() => navigate("/results", { replace: true })}
          >
            Generar recomendaciones
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>💳 Recarga tus tokens</h1>
        <p>Necesitas tokens para generar recomendaciones</p>
      </div>

      {error && (
        <p className="payments-error">⚠️ {error}</p>
      )}

      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {clientSecret && selectedPlan && (
          <motion.div
            className="checkout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="checkout-modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
            >
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary:    "#6366f1",
                      colorBackground: "#1a1a2e",
                      colorText:       "#ffffff",
                      borderRadius:    "10px",
                    },
                  },
                }}
              >
                <CheckoutForm
                  plan={selectedPlan}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PLANES ── */}
      <div className="payments-grid">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.key}
            className={`payment-card ${plan.key === "pro" ? "featured" : ""}`}
            whileHover={{ scale: 1.03 }}
          >
            {plan.key === "pro" && (
              <span className="featured-badge">⭐ Más popular</span>
            )}

            <h2>{plan.label}</h2>

            <p className="tokens">
              {plan.tokens === 9999 ? "∞" : plan.tokens} tokens
            </p>

            <p className="description">{plan.description}</p>

            <h3 className="price">{plan.price}</h3>

            <button
              className="buy-btn"
              onClick={() => handleBuy(plan)}
              disabled={loading}
            >
              {loading && selectedPlan?.key === plan.key
                ? "Cargando..."
                : "Comprar"}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="payments-footer">
        <button
          className="back-btn"
          onClick={() => {
            navigate("/", { replace: true });
            window.scrollTo(0, 0);
          }}
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}