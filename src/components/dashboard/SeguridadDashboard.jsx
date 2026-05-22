export default function SeguridadDashboard() {
  return (
    <section
      style={{
        marginTop: "60px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Seguridad en Bogotá
        </h2>

        <p
          style={{
            opacity: 0.75,
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: "1.5",
          }}
        >
          Claudia analiza datos oficiales de criminalidad en Colombia para ayudarte
          a tomar decisiones más seguras en tus desplazamientos y planes.
        </p>
      </div>

      {/* DASHBOARD POWER BI */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1512 / 945",
          maxHeight: "80vh",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          background: "transparent",
        }}
      >
        <iframe
          title="Dashboard Seguridad Bogotá"
          src="https://app.powerbi.com/view?r=eyJrIjoiNmZiYzgyMTYtZDIzYy00ZDg2LTgzZTgtZmIwMTBhMThlNjcwIiwidCI6Ijc5ODcxZWIxLTYwOTYtNDJiZi05OGVmLWI0ZjNlNGVmODMxOCIsImMiOjR9"
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* FOOTER / FUENTES */}
      <div
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          opacity: 0.75,
          lineHeight: "1.5",
        }}
      >
        <p style={{ marginBottom: "8px" }}>
          Datos procesados a partir de fuentes oficiales del Estado colombiano,
          utilizados para análisis de seguridad ciudadana y comportamiento delictivo.
        </p>

        <small style={{ display: "block", opacity: 0.65 }}>
          Fuente 1:{" "}
          <a
            href="https://www.datos.gov.co/Seguridad-y-Defensa/Turistas-v-ctimas-de-delitos-en-Colombia/p2r3-hbie/about_data"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#5E8152" }}
          >
            Datos Abiertos Colombia — Turistas víctimas de delitos en Colombia
          </a>
        </small>

        <small style={{ display: "block", opacity: 0.65, marginTop: "4px" }}>
          Fuente 2:{" "}
          <a
            href="https://www.policia.gov.co/estadistica-delictiva/hurto-personas"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#5E8152" }}
          >
            Policía Nacional de Colombia — Estadísticas de hurto a personas
          </a>
        </small>
      </div>
    </section>
  );
}