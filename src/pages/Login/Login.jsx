import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import LoginForm from "../../components/auth/LoginForm";

import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // errores por campo (más pro)
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  // =========================
  // VALIDACIONES
  // =========================
  const validateUsername = (username) => {
    const value = username?.trim();

    if (!value) return "El usuario es obligatorio";

    // SOLO letras (sin números, sin @, sin símbolos)
    const regex = /^[a-zA-Z]+$/;

    if (!regex.test(value)) {
      return "Solo letras (sin números, sin @ ni símbolos)";
    }

    if (value.length < 3) {
      return "Mínimo 3 caracteres";
    }

    if (value.length > 20) {
      return "Máximo 20 caracteres";
    }

    return "";
  };

  const validatePassword = (password) => {
    const value = password;

    if (!value) return "La contraseña es obligatoria";
    if (value.length < 6) return "Mínimo 6 caracteres";

    return "";
  };

  // =========================
  // LOGIN
  // =========================
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

      await login({
        username: data.username.trim(),
        password: data.password,
      });

      navigate("/explore");
    } catch (err) {
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

  const handleLogout = () => {};

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogin={() => {}}
        onRegister={handleGoRegister}
        onLogout={handleLogout}
      />

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