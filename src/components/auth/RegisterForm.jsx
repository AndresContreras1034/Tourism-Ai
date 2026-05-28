import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser, loginUser } from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";

const STORAGE_KEY = "registerForm";

// ==============================
// 🔒 PASSWORD RULES
// ==============================
const passwordRules = [
  { label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Una mayúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Una minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Un número", test: (p) => /\d/.test(p) },
  {
    label: "Un carácter especial",
    test: (p) =>
      /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?¿¡.=]/.test(p),
  },
];

// ==============================
// 🔥 PASSWORD STRENGTH
// ==============================
const getPasswordStrength = (password = "") => {
  const score = passwordRules.filter((r) => r.test(password)).length;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
};

// ==============================
// 💾 STORAGE
// ==============================
const loadForm = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", password: "", confirmPassword: "" };
  } catch {
    return { name: "", email: "", password: "", confirmPassword: "" };
  }
};

const saveForm = (form) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch {}
};

// ==============================
// 🚀 COMPONENT
// ==============================
export default function RegisterForm() {
  const navigate = useNavigate();

  // ✅ FIX: importar syncSession del contexto
  const { syncSession } = useContext(AuthContext);

  const [form, setForm] = useState(loadForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    saveForm(form);
  }, [form]);

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  // ==============================
  // 🔍 VALIDATION
  // ==============================
  const validate = () => {
    const e = {};

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirm = form.confirmPassword;

    if (!name) e.name = "El nombre es obligatorio";
    else if (!/^[a-zA-Z\s]{3,30}$/.test(name))
      e.name = "Nombre inválido";

    if (!email) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Correo inválido";

    if (!password) e.password = "La contraseña es obligatoria";
    else if (passwordRules.some((r) => !r.test(password)))
      e.password = "La contraseña no cumple requisitos";

    if (!confirm) e.confirmPassword = "Confirma la contraseña";
    else if (confirm !== password)
      e.confirmPassword = "Las contraseñas no coinciden";

    return e;
  };

  // ==============================
  // ✍️ CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==============================
  // 🚀 SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      console.log("🧾 REGISTER START", payload);

      // 1️⃣ REGISTER
      const res = await registerUser(payload);

      if (!res) throw new Error("Error en registro");

      console.log("🟡 REGISTER OK", res);

      // 2️⃣ AUTO LOGIN
      const loginRes = await loginUser({
        email: payload.email,
        password: payload.password,
      });

      console.log("🟢 AUTO LOGIN OK", loginRes);

      // 3️⃣ ENSURE SESSION
      if (loginRes?.token && loginRes?.user) {
        localStorage.setItem("user", JSON.stringify(loginRes.user));
        localStorage.setItem("token", loginRes.token);

        // ✅ FIX: notificar al AuthContext inmediatamente
        // para que user?.id esté disponible en AppRouter
        syncSession();

        console.log("💾 SESSION SAVED + CONTEXT SYNCED");
      }

      // 4️⃣ CLEAN FORM + NAVIGATE
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("onboardingStep", "true");

      navigate("/onboarding");
    } catch (err) {
      console.error("❌ REGISTER ERROR", err);

      setErrors({
        general:
          err?.message ||
          "Error inesperado al registrarse",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

        {errors.general && (
          <div className="error-box">{errors.general}</div>
        )}

        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="error">{errors.password}</span>
        )}

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}

        <button disabled={loading}>
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}