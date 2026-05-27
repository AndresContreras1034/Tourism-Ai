import { useState } from "react";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);

  return (
    <section
      style={{
        marginTop: "60px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Dashboard de análisis
        </h2>

        <p
          style={{
            opacity: 0.75,
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: "1.5",
          }}
        >
          Este panel centraliza métricas clave como planes activos,
          presupuesto, rendimiento, rating y comportamiento general de la
          plataforma para la toma de decisiones.
        </p>
      </div>

      {/* DASHBOARD POWER BI */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: "80vh",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          position: "relative",
          background: "#0f0f14",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "14px",
              opacity: 0.7,
            }}
          >
            Cargando dashboard...
          </div>
        )}

        <iframe
          title="Dashboard de análisis"
          src="https://app.powerbi.com/view?r=eyJrIjoiNmZiYzgyMTYtZDIzYy00ZDg2LTgzZTgtZmIwMTBhMThlNjcwIiwidCI6Ijc5ODcxZWIxLTYwOTYtNDJiZi05OGVmLWI0ZjNlNGVmODMxOCIsImMiOjR9"
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          opacity: 0.75,
          lineHeight: "1.5",
        }}
      >
        <p style={{ marginBottom: "6px" }}>
          Datos centralizados para análisis operativo y toma de decisiones
          estratégicas dentro de la plataforma.
        </p>
      </div>
    </section>
  );
}