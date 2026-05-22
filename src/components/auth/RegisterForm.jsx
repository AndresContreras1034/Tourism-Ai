import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import "./Register.css";

const STORAGE_KEY = "registerForm";

// ==============================
// 🔒 PASSWORD RULES (SOURCE OF TRUTH)
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
// 🔐 SAFE STORAGE HELPERS
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
  } catch {
    // fail silently (no crash ever)
  }
};

// ==============================
// 🚀 COMPONENT
// ==============================
export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(loadForm);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==============================
  // 💾 AUTO SAVE (DEBOUNCED FEEL)
  // ==============================
  useEffect(() => {
    saveForm(form);
  }, [form]);

  // ==============================
  // 🔥 PASSWORD STRENGTH MEMO
  // ==============================
  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  // ==============================
  // 🔍 VALIDATION ENGINE
  // ==============================
  const validate = () => {
    const e = {};

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirm = form.confirmPassword;

    // NAME
    if (!name) e.name = "El nombre es obligatorio";
    else if (!/^[a-zA-Z\s]{3,30}$/.test(name))
      e.name = "Nombre inválido (solo letras, 3-30 caracteres)";

    // EMAIL
    if (!email) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Correo inválido";

    // PASSWORD
    if (!password) e.password = "La contraseña es obligatoria";
    else {
      const failedRules = passwordRules.filter((r) => !r.test(password));
      if (failedRules.length > 0) {
        e.password = "La contraseña no cumple los requisitos";
      }
    }

    // CONFIRM
    if (!confirm) e.confirmPassword = "Confirma la contraseña";
    else if (confirm !== password)
      e.confirmPassword = "Las contraseñas no coinciden";

    return e;
  };

  // ==============================
  // ✍️ CHANGE HANDLER
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear only field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==============================
  // 🚀 SUBMIT (SAFE MODE)
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🛑 anti double submit

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

      const res = await registerUser(payload);

      if (!res) throw new Error("Respuesta inválida del servidor");

      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("onboardingStep", "true");

      navigate("/onboarding");
    } catch (err) {
      setErrors({
        general:
          err?.response?.data?.message ||
          err?.message ||
          "Error inesperado al registrarse",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // 🎨 UI
  // ==============================
  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2>Crear cuenta</h2>

        {errors.general && (
          <div className="error-box">{errors.general}</div>
        )}

        {/* NAME */}
        <div className="form-group">
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <ul className="rules">
            {passwordRules.map((r, i) => (
              <li key={i} style={{ color: r.test(form.password) ? "green" : "red" }}>
                {r.label}
              </li>
            ))}
          </ul>

          <div className="strength-bar">
            <div className={`bar ${strength}`} />
            <small>
              {strength === "weak" && "Débil"}
              {strength === "medium" && "Media"}
              {strength === "strong" && "Fuerte"}
            </small>
          </div>

          {errors.password && (
            <span className="error">{errors.password}</span>
          )}
        </div>

        {/* CONFIRM */}
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <button disabled={loading}>
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}