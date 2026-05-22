import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ReviewModal.css";

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // 🪟 estado del popup
  const [showWarning, setShowWarning] = useState(false);

  const badPatterns = [
    /m[i1!|]e?r[d]+a/i,
    /p[u*]t[a@]/i,
    /p[u*]t[o0]/i,
    /idi[o0]t[a@]/i,
    /est[u*]p[i1]d[o0]/i,
    /imb[e3]c[i1]l/i,
    /p[e3]nd[e3]j[o0]/i,
    /m[a@]r[i1]c[a@]/i,
    /gon[o0]rr[e3]a/i,
    /h[p]+t[a@]/i,
  ];

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[@]/g, "a")
      .replace(/[3]/g, "e")
      .replace(/[1!|]/g, "i")
      .replace(/[0]/g, "o");
  };

  const containsBadWords = (text) => {
    const cleanText = normalizeText(text);
    return badPatterns.some((pattern) => pattern.test(cleanText));
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !comment) return;

    if (containsBadWords(name) || containsBadWords(comment)) {
      setShowWarning(true); // 👈 mostramos popup
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name,
        country,
        rating,
        comment,
        flag: "🌍",
      });

      setName("");
      setCountry("");
      setComment("");
      setRating(5);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3>✨ Añadir reseña</h3>

        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="País"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <textarea
          placeholder="Tu experiencia..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="rating">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button onClick={onClose} className="cancel">
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="submit"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>

        {/* 🚨 POPUP EMERGENTE */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              className="warning-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h4>⚠️ Lenguaje no permitido</h4>
              <p>
                Por favor evita usar palabras ofensivas. Mantén un lenguaje
                respetuoso en tu reseña.
              </p>

              <button onClick={() => setShowWarning(false)}>
                Entendido
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}