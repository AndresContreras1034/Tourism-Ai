import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MfaQRModal.css";

export default function MfaQRModal({ isOpen, onClose, userId, onSuccess }) {
  const [qrData,  setQrData]  = useState(null);
  const [token,   setToken]   = useState("");
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState(1);
  const [error,   setError]   = useState("");

  // ✅ FIX: useRef para evitar doble llamada (React StrictMode monta dos veces)
  const hasGenerated = useRef(false);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  /* =========================
     GENERATE QR
  ========================= */
  const generateQR = async () => {
    // ✅ FIX: guard para evitar que se llame dos veces en paralelo
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    try {
      setLoading(true);
      setError("");

      const authToken = localStorage.getItem("token");

      const res = await fetch(`${API}/mfa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
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
      // ✅ resetear el guard si falla, para permitir reintento
      hasGenerated.current = false;
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
      const authToken  = localStorage.getItem("token");

      if (!userId)              throw new Error("userId faltante");
      if (cleanToken.length !== 6) throw new Error("Código inválido");

      const res = await fetch(`${API}/mfa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({ userId, token: cleanToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error MFA");
      }

      console.log("✅ MFA ACTIVADO");
      setStep(3);

      setTimeout(() => {
        // ✅ FIX: onSuccess notifica al router (syncSession + closeAll)
        // luego navega al home
        onSuccess?.({ mfaEnabled: true, userId });
        navigate("/", { replace: true });
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
      hasGenerated.current = false; // reset al abrir
      generateQR();
    }
  }, [isOpen]);

  /* =========================
     CERRAR
  ========================= */
  const handleClose = () => {
    // ✅ FIX: navegar a / en lugar de volver al onboarding
    onClose?.();
    navigate("/", { replace: true });
  };

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
            <p>Escanea el QR con tu app autenticadora</p>

            {qrData?.qrCode && (
              <img src={qrData.qrCode} width={200} alt="QR MFA" />
            )}

            <input
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
            />

            <button onClick={verifyToken} disabled={loading || token.length !== 6}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        )}

        {step === 3 && (
          <h3>✅ MFA activado correctamente</h3>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* ✅ FIX: botón cerrar navega a / */}
        <button onClick={handleClose}>✕ Cerrar</button>

      </div>
    </div>
  );
}