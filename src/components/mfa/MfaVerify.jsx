import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API_URL from "../../services/api";

export default function MfaVerify({ userId, onSuccess }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { completeMfaLogin } = useContext(AuthContext);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("\n=== VERIFY LOGIN MFA ===");
      console.log("USER ID:", userId);
      console.log("TOKEN:", token);

      if (!userId) throw new Error("Falta userId");
      if (!token || token.length !== 6) throw new Error("Código inválido");

      const response = await fetch(`${API_URL}/mfa/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });

      console.log("STATUS:", response.status);
      const data = await response.json();
      console.log("RESPONSE:", data);

      if (!response.ok || !data.success) throw new Error(data.message || "Error MFA");

      const finalToken = data.token || data.accessToken || data.data?.token;
      console.log("FINAL TOKEN:", finalToken);
      if (!finalToken) throw new Error("No llegó token");

      const user = data.user || data.data?.user || null;

      localStorage.setItem("token", finalToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("tempToken");
      sessionStorage.removeItem("mfa_userId");
      console.log("LOCAL STORAGE:", {
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user"),
      });

      if (completeMfaLogin) completeMfaLogin({ token: finalToken, user });

      console.log("✅ LOGIN COMPLETADO");
      onSuccess?.(data);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("MFA ERROR:", err);
      setError(err.message || "Error MFA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-verify-card">
      <h2>🔐 Verificación MFA</h2>
      <p>Ingresa el código del autenticador</p>
      <input
        type="text"
        value={token}
        placeholder="123456"
        inputMode="numeric"
        onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verificando..." : "Verificar"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}