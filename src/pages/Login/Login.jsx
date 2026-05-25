import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import LoginForm from "../../components/auth/LoginForm";

import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  /* =========================================================
     🔐 VALIDACIONES
  ========================================================= */
  const validateUsername = (username) => {
    const value = username?.trim();

    if (!value) return "El usuario es obligatorio";

    const regex = /^[a-zA-Z]+$/;

    if (!regex.test(value)) {
      return "Solo letras (sin números ni símbolos)";
    }

    if (value.length < 3) return "Mínimo 3 caracteres";
    if (value.length > 20) return "Máximo 20 caracteres";

    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es obligatoria";
    if (password.length < 6) return "Mínimo 6 caracteres";
    return "";
  };

  /* =========================================================
     🚀 LOGIN FLOW CORREGIDO
  ========================================================= */
  const handleLogin = async (data) => {
    setLoading(true);

    const usernameError = validateUsername(data.username);
    const passwordError = validatePassword(data.password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
        general: "",
      });
      setLoading(false);
      return;
    }

    try {
      setErrors({ username: "", password: "", general: "" });

      const result = await login({
        username: data.username.trim(),
        password: data.password,
      });

      /* =========================================================
         🔐 MFA FLOW (IMPORTANTE)
      ========================================================= */
      if (result?.requiresMFA) {
        console.log("🔐 MFA requerido → se detiene navegación");
        setLoading(false);
        return;
      }

      /* =========================================================
         🟢 LOGIN COMPLETO → SOLO AQUÍ SE NAVEGA
      ========================================================= */
      navigate("/explore");

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);

      setErrors({
        username: "",
        password: "",
        general: "Credenciales inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      {/* NAVBAR (SIN PROPS - USA AUTHCONTEXT) */}
      <Navbar />

      {/* MAIN */}
      <main className="login-content">
        <LoginForm
          onLogin={handleLogin}
          loading={loading}
          errors={errors}
        />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}