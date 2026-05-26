import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";

export default function CheckoutForm({ plan, onSuccess, onCancel }) {
  const stripe   = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess(plan);
      }

    } catch (err) {
      setError("Error procesando el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-plan-summary">
        <h3>{plan.label}</h3>
        <p>{plan.tokens === 9999 ? "∞" : plan.tokens} tokens — ${(plan.amount / 100).toFixed(2)}</p>
      </div>

      <PaymentElement />

      {error && <p className="checkout-error">⚠️ {error}</p>}

      <div className="checkout-actions">
        <button
          type="button"
          className="checkout-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="checkout-submit"
          disabled={!stripe || loading}
        >
          {loading ? "Procesando..." : "Confirmar pago"}
        </button>
      </div>
    </form>
  );
}