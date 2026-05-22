import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import RegisterForm from "../../components/auth/RegisterForm";

import { AuthContext } from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const { login, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // =========================
  // VALIDACIONES PRO
  // =========================

  const validateUsername = (username) => {
    const value = username?.trim();

    if (!value) return "El usuario es obligatorio";

    // solo letras (puedes cambiar a más flexible si quieres)
    const regex = /^[a-zA-Z]+$/;

    if (!regex.test(value)) {
      return "Solo letras (sin números, sin @ ni símbolos)";
    }

    if (value.length < 3) return "Mínimo 3 caracteres";
    if (value.length > 20) return "Máximo 20 caracteres";

    return "";
  };

  const validateEmail = (email) => {
    const value = email?.trim();

    if (!value) return "El email es obligatorio";

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      return "Email inválido";
    }

    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es obligatoria";
    if (password.length < 8) return "Mínimo 8 caracteres";

    // fuerza básica real
    if (!/[A-Z]/.test(password)) return "Debe incluir una mayúscula";
    if (!/[0-9]/.test(password)) return "Debe incluir un número";

    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Confirma la contraseña";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    return "";
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (data) => {
    setLoading(true);

    const usernameError = validateUsername(data.username);
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);
    const confirmPasswordError = validateConfirmPassword(
      data.password,
      data.confirmPassword
    );

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        general: "",
      });

      setLoading(false);
      return;
    }

    try {
      setErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
      });

      const payload = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const res = await register(payload);

      console.log("🟢 Usuario registrado:", res);

      // sincronizar auth global
      login(res);

      // onboarding flag
      localStorage.setItem("onboardingStep", "true");

      navigate("/onboarding");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Error al registrarse",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <Navbar user={user} />

      <main className="register-content">
        <RegisterForm
          onRegister={handleRegister}
          loading={loading}
          errors={errors}
        />
      </main>

      <Footer />
    </div>
  );
}