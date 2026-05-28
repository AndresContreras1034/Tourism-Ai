import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FiltersForm.css";

import { saveUserProfile } from "../../services/api";

const INITIAL_STATE = {
  originCity: "Bogotá",
  budget: "",
  travelType: "",
  climate: "",
  interests: [],
  companions: "",
  duration: "",
};

const INTERESTS = [
  "🏞️ Naturaleza",
  "⛰️ Montaña",
  "🏛️ Cultura e historia",
  "🍲 Gastronomía local",
  "🎉 Vida nocturna",
  "🧘 Relax y descanso",
  "📸 Fotografía",
  "🚗 Road trips",
  "🛍️ Compras",
  "🌄 Miradores y paisajes",
];

export default function FiltersForm({ onSuccess }) {
  const navigate = useNavigate();

  const [data, setData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔁 toggle intereses
  const toggleInterest = (interest) => {
    setData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  // ✍️ inputs
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 SUBMIT FINAL
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        interestsText: data.interests.join(", "),
        baseCity: "Bogotá",
        currency: "COP",
      };

      // 💾 1. GUARDAR EN DB (POST /profile)
      await saveUserProfile(payload);

      // 💾 2. LOCAL CACHE (UX rápido)
      localStorage.setItem("userProfile", JSON.stringify(payload));

      // ✅ FIX: llamar onSuccess en lugar de navigate("/mfa")
      // Onboarding.jsx recibe onSuccess y llama onComplete()
      // que abre el QR modal desde AppRouter
      if (onSuccess) {
        onSuccess(payload);
      } else {
        // fallback por si FiltersForm se usa fuera del Onboarding
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setError("No se pudo guardar tu perfil. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="filters-ai" onSubmit={handleSubmit}>

      <h2>🌍 Diseña tu experiencia desde Bogotá</h2>
      <p>Te creamos experiencias personalizadas con IA</p>

      {error && <div className="error-box">{error}</div>}

      {/* CIUDAD */}
      <div className="field">
        <label>📍 Ciudad base</label>
        <input
          name="originCity"
          value={data.originCity}
          onChange={handleChange}
        />
      </div>

      {/* PRESUPUESTO */}
      <div className="field">
        <label>💰 Presupuesto (COP)</label>
        <select name="budget" onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="low">Económico</option>
          <option value="medium">Medio</option>
          <option value="high">Alto</option>
        </select>
      </div>

      {/* TIPO */}
      <div className="field">
        <label>🎯 Tipo de viaje</label>
        <select name="travelType" onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="adventure">Aventura</option>
          <option value="relax">Relax</option>
          <option value="cultural">Cultural</option>
          <option value="gastronomy">Gastronomía</option>
        </select>
      </div>

      {/* COMPAÑÍA */}
      <div className="field">
        <label>👥 Compañía</label>
        <select name="companions" onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="solo">Solo</option>
          <option value="couple">Pareja</option>
          <option value="friends">Amigos</option>
          <option value="family">Familia</option>
        </select>
      </div>

      {/* DURACIÓN */}
      <div className="field">
        <label>📆 Duración</label>
        <select name="duration" onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="weekend">Fin de semana</option>
          <option value="short">3-5 días</option>
          <option value="medium">1 semana</option>
          <option value="long">Más de 1 semana</option>
        </select>
      </div>

      {/* INTERESES */}
      <div className="field">
        <label>🔥 Intereses</label>
        <div className="interests-grid">
          {INTERESTS.map((item) => (
            <button
              key={item}
              type="button"
              className={`interest-chip ${
                data.interests.includes(item) ? "active" : ""
              }`}
              onClick={() => toggleInterest(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* BOTÓN */}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Creando perfil..." : "✨ Crear experiencia"}
      </button>

    </form>
  );
}