import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MfaQRModal.css";

import { AuthContext } from "../../context/AuthContext";

export default function MfaQRModal({ isOpen, onClose, userId }) {
  const [qrData, setQrData] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const { setUser, setToken: setAuthToken } = useContext(AuthContext);

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const hasLoaded = useRef(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // =========================
  // 🔐 GENERAR QR
  // =========================
  const generateQR = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) throw new Error("No hay userId MFA");

      const res = await fetch(`${API}/mfa/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok || !data?.data) {
        throw new Error(data?.message || "Error generando MFA");
      }

      setQrData(data.data);
      setStep(2);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔐 VERIFY MFA TOKEN
  // =========================
  const verifyToken = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) throw new Error("No hay userId activo");
      if (!token || token.length < 4) throw new Error("Código inválido");

      const res = await fetch(`${API}/mfa/verify-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Código inválido");
      }

      // =========================
      // 🔥 CRÍTICO: ACTUALIZAR AUTH CONTEXT
      // =========================
      const fakeUser = {
        id: userId,
        mfa_enabled: true,
      };

      const existingToken = localStorage.getItem("token");

      if (existingToken) {
        setAuthToken(existingToken);
      }

      setUser(fakeUser);

      localStorage.setItem("user", JSON.stringify(fakeUser));

      // =========================
      // UI SUCCESS
      // =========================
      setStep(3);

      setTimeout(() => {
        onClose?.();
        navigate("/", { replace: true });
      }, 800);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🚀 INIT
  // =========================
  useEffect(() => {
    if (isOpen && step === 1 && !hasLoaded.current) {
      hasLoaded.current = true;
      generateQR();
    }

    if (!isOpen) {
      hasLoaded.current = false;
      setStep(1);
      setQrData(null);
      setToken("");
      setError("");
    }
  }, [isOpen]);

  // =========================
  // UI
  // =========================
  return (
    <div className="mfa-overlay">
      <div className="mfa-modal">

        <h2>🔐 Configuración MFA</h2>

        {step === 1 && (
          <div>
            <p>Generando autenticador...</p>
            {loading && <p>⏳ Creando QR...</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <p>Escanea el QR</p>

            {qrData?.qrCode && (
              <img src={qrData.qrCode} alt="MFA QR" width={200} />
            )}

            {qrData?.secret && (
              <p style={{ fontSize: 12 }}>
                🔑 Backup: <b>{qrData.secret}</b>
              </p>
            )}

            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Código 6 dígitos"
            />

            <button onClick={verifyToken} disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>✅ MFA activado correctamente</h3>
            <p>Redirigiendo...</p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose}>✕ Cerrar</button>

      </div>
    </div>
  );
}