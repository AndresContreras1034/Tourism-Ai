import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function MfaVerify({ userId, onSuccess }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { completeMfaLogin } = useContext(AuthContext);

  // =========================
  // 🔐 VERIFICAR MFA LOGIN
  // =========================
  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/mfa/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token,
        }),
      });

      const data = await res.json();

      console.log("📦 MFA LOGIN RESPONSE:", data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Código inválido");
      }

      // =========================
      // 🔥 LOGIN FINAL CORRECTO
      // =========================

      // ✔ activa sesión global (CRÍTICO)
      completeMfaLogin({
        token: data.token,
        user: data.user,
      });

      // ✔ callback opcional
      onSuccess?.(data);

      // ✔ redirección al hero
      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ MFA VERIFY ERROR:", err);
      setError("Código incorrecto, intenta nuevamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-verify-card">
      <h2>🔐 Verificación en dos pasos</h2>

      <p>Ingresa el código de tu app autenticadora</p>

      <input
        type="text"
        placeholder="000000"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verificando..." : "Verificar"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}