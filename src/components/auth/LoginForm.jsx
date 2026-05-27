import { useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 useLocation

import { loginUser, verifyMfaLogin } from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";

import "./Login.css";
import MfaQRModal from "../../components/mfa/MfaQrModal";

const validateEmail = (email) => {
  const value = email.trim().toLowerCase();
  if (!value) return "Correo obligatorio";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Correo inválido";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Contraseña obligatoria";
  if (password.length < 6) return "Mínimo 6 caracteres";
  return "";
};

const validateMfaCode = (code) => {
  if (!code) return "Código MFA requerido";
  if (!/^\d{6}$/.test(code)) return "Debe tener 6 dígitos";
  return "";
};

export default function LoginForm() {
  const navigate  = useNavigate();
  const location  = useLocation(); // 👈 nuevo
  const { login, completeMfaLogin } = useContext(AuthContext);

  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [mfaUserId, setMfaUserId]   = useState(null);
  const [showQR, setShowQR]         = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [mfaCode, setMfaCode]       = useState("");

  const normalizedEmail = useMemo(
    () => form.email.trim().toLowerCase(),
    [form.email]
  );

  /* =========================================================
     🔀 HELPER: decide a dónde navegar post-login
  ========================================================= */
  const resolveRedirect = (role) => {
    const from = location.state?.from;
    if (from) return from;
    if (role === "admin" || role === "superadmin") return "/admin";
    return "/";
  };

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const emailError = validateEmail(form.email);
    const passError  = validatePassword(form.password);

    if (emailError || passError) {
      setErrors({ email: emailError, password: passError });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await loginUser({
        email:    normalizedEmail,
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", response);

      if (response.requiresMFA) {
        console.log("🔐 MFA requerido →", response.userId);

        setMfaUserId(String(response.userId));

        if (response.tempToken) {
          localStorage.setItem("tempToken", response.tempToken);
        }

        if (response.mfaEnabled) {
          setShowVerify(true);
        } else {
          setShowQR(true);
        }

        return;
      }

      // 🟢 LOGIN NORMAL (sin MFA)
      login(response);

      const redirect = resolveRedirect(response.user?.role); // 👈
      setTimeout(() => navigate(redirect, { replace: true }), 0);

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      setErrors({ general: err.message || "Error login" });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VERIFY MFA LOGIN (FINAL LOGIN REAL)
  ========================================================= */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validation = validateMfaCode(mfaCode);
    if (validation) {
      setErrors({ general: validation });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const userId = mfaUserId || sessionStorage.getItem("mfa_userId");

      console.log("🔐 VERIFY MFA LOGIN", { userId, token: mfaCode });

      const response = await verifyMfaLogin({ userId, token: mfaCode });

      console.log("📦 MFA RESPONSE:", response);

      const user =
        response.user      ||
        response.data?.user;

      const token =
        response.token      ||
        response.accessToken ||
        response.data?.token;

      if (!user || !token) {
        throw new Error("Backend no devolvió user/token");
      }

      completeMfaLogin({ user, token });

      localStorage.removeItem("tempToken");
      setShowVerify(false);

      const redirect = resolveRedirect(user?.role); // 👈
      setTimeout(() => navigate(redirect, { replace: true }), 50);

    } catch (err) {
      console.error("❌ MFA ERROR:", err);
      setErrors({ general: err.message || "MFA inválido" });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="login-wrapper">

      {/* QR SETUP */}
      {showQR && (
        <MfaQRModal
          isOpen={showQR}
          userId={mfaUserId}
          onClose={() => {
            console.log("✅ QR cerrado → verify login MFA");
            setShowQR(false);
            setShowVerify(true);
          }}
        />
      )}

      {/* VERIFY MFA LOGIN */}
      {showVerify && (
        <div className="mfa-modal">
          <form onSubmit={handleVerify}>
            <h2>🔐 Verificar MFA</h2>

            {errors.general && (
              <div className="error-box">{errors.general}</div>
            )}

            <input
              value={mfaCode}
              onChange={(e) =>
                setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Código 6 dígitos"
              maxLength={6}
              inputMode="numeric"
              autoFocus
            />

            <button disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </form>
        </div>
      )}

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit} className="login-form">

        {errors.general  && <div className="error-box">{errors.general}</div>}
        {errors.email    && <div className="error-box">{errors.email}</div>}
        {errors.password && <div className="error-box">{errors.password}</div>}

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />

        <button disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

      </form>
    </div>
  );
}