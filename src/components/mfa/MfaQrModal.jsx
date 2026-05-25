import { useState, useEffect, useRef } from "react";
import "./MfaQRModal.css";

export default function MfaQRModal({ isOpen, onClose, userId, onSuccess }) {
  const [qrData, setQrData] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const hasLoaded = useRef(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  /* =========================
     GENERATE QR
  ========================= */
  const generateQR = async () => {
    try {
      setLoading(true);
      setError("");

      const tempToken = localStorage.getItem("tempToken");

      const res = await fetch(`${API}/mfa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: tempToken ? `Bearer ${tempToken}` : "",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error generando QR");
      }

      setQrData(data.data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY MFA SETUP
  ========================= */
  const verifyToken = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanToken = token.replace(/\D/g, "").slice(0, 6);
      const tempToken = localStorage.getItem("tempToken");

      if (!userId) throw new Error("userId faltante");
      if (cleanToken.length !== 6) throw new Error("Código inválido");

      const res = await fetch(`${API}/mfa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tempToken && { Authorization: `Bearer ${tempToken}` }),
        },
        body: JSON.stringify({
          userId,
          token: cleanToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error MFA");
      }

      console.log("✅ MFA ACTIVADO");

      setStep(3);

      setTimeout(() => {
        onClose?.();

        // 🔥 IMPORTANTE: notificar al login flow
        onSuccess?.({
          mfaEnabled: true,
          userId,
        });
      }, 800);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setQrData(null);
      setToken("");
      setError("");
      hasLoaded.current = false;

      generateQR();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mfa-overlay">
      <div className="mfa-modal">

        <h2>🔐 Configurar MFA</h2>

        {step === 1 && (
          <p>Generando autenticador...</p>
        )}

        {step === 2 && (
          <div>
            <p>Escanea el QR</p>

            {qrData?.qrCode && (
              <img src={qrData.qrCode} width={200} />
            )}

            <input
              value={token}
              onChange={(e) =>
                setToken(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
            />

            <button onClick={verifyToken} disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        )}

        {step === 3 && (
          <h3>✅ MFA activado</h3>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose}>✕ Cerrar</button>

      </div>
    </div>
  );
}