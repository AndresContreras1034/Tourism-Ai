import { useState, useEffect } from "react";
import MfaQRModal from "./MfaQrModal";

export default function MfaSetup({ user }) {

  const [openModal, setOpenModal] =
    useState(false);

  const [enabled, setEnabled] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // PROTECCIÓN
  // =========================
  if (!user?.id) {
    console.log(
      "MFA SETUP -> USER INVÁLIDO"
    );

    return null;
  }

  const userId = user.id;

  console.log(
    "MFA USER:",
    user
  );

  console.log(
    "MFA USER ID:",
    userId
  );

  // =========================
  // CHECK STATUS
  // =========================
  const checkMfaStatus = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      console.log(
        "CHECK MFA STATUS"
      );

      console.log(
        "TOKEN:",
        token
      );

      console.log(
        "USER ID:",
        userId
      );

      const response =
        await fetch(
          `http://localhost:3000/api/user/${userId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "STATUS:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "DATA:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Error API"
        );
      }

      const mfaEnabled = !!(
        data.user?.mfa_enabled ??
        data.mfa_enabled
      );

      console.log(
        "MFA ENABLED:",
        mfaEnabled
      );

      setEnabled(
        mfaEnabled
      );

    } catch (err) {

      console.error(
        "CHECK MFA ERROR"
      );

      console.error(err);

      setError(
        err.message ||
        "Error verificando MFA"
      );

    } finally {

      setLoading(false);

    }
  };

  // cargar automático
  useEffect(() => {

    checkMfaStatus();

  }, []);

  return (

    <div className="mfa-setup-card">

      <h3>

        🔐 Autenticación MFA

      </h3>

      <p>

        Estado:

        {" "}

        {enabled ? (

          <span
            style={{
              color:
                "green",
            }}
          >

            Activo

          </span>

        ) : (

          <span
            style={{
              color:
                "red",
            }}
          >

            Desactivado

          </span>

        )}

      </p>

      <div
        style={{
          display:
            "flex",

          gap: "10px",
        }}
      >

        <button

          onClick={() =>
            setOpenModal(
              true
            )
          }

          disabled={
            enabled
          }

        >

          Configurar MFA

        </button>

        <button

          onClick={
            checkMfaStatus
          }

          disabled={
            loading
          }

        >

          {

            loading

            ? "Verificando..."

            : "Actualizar"

          }

        </button>

      </div>

      {error && (

        <p
          style={{
            color:
              "red",
          }}
        >

          {error}

        </p>

      )}

      <MfaQRModal

        isOpen={
          openModal
        }

        onClose={() => {

          console.log(
            "MODAL CERRADO"
          );

          setOpenModal(
            false
          );

          checkMfaStatus();

        }}

        userId={userId}

      />

    </div>

  );
}