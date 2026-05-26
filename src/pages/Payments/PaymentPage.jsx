import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>💳 Te quedaste sin tokens</h1>
      <p>Recarga para seguir generando planes con IA</p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/plans")}
      >
        ¿Quieres ver nuestros planes?
      </button>
    </div>
  );
}