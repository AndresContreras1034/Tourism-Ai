import { useState } from "react";
import MfaQRModal from "./MfaQrModal";

export default function MfaSetup({ user }) {
  const [openModal, setOpenModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 PROTECCIÓN CRÍTICA
  if (!user?.id) {
    return null;
  }

  const userId = user.id;

  // =========================
  // 🔐 CHECK STATUS MFA
  // =========================
  const checkMfaStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:3000/user/${userId}`
      );

      if (!res.ok) {
        throw new Error("Error API");
      }

      const data = await res.json();

      setEnabled(!!data?.mfa_enabled);
    } catch (err) {
      console.error(err);
      setError("Error verificando estado MFA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-setup-card">
      <h3>🔐 Autenticación en dos pasos (MFA)</h3>

      {/* STATUS */}
      <p>
        Estado:{" "}
        {enabled ? (
          <span style={{ color: "green" }}>Activo</span>
        ) : (
          <span style={{ color: "red" }}>Desactivado</span>
        )}
      </p>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setOpenModal(true)}
          disabled={enabled}
        >
          Configurar MFA
        </button>

        <button onClick={checkMfaStatus} disabled={loading}>
          {loading ? "Verificando..." : "Actualizar estado"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* MODAL */}
      <MfaQRModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        userId={userId}
      />
    </div>
  );
}