import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { fetchAnalyticsSummary } from "../../services/analytics.service";
import "./Analytics.css";

// ─── shadcn-style primitives (Tailwind + CSS vars assumed in project) ─────────
const Card = ({ children, className = "" }) => (
  <div className={`analytics-card ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => (
  <div className="analytics-card-header">{children}</div>
);
const CardTitle = ({ children }) => (
  <h3 className="analytics-card-title">{children}</h3>
);
const CardContent = ({ children }) => (
  <div className="analytics-card-content">{children}</div>
);

// ─── Color palette ─────────────────────────────────────────────────────────────
const PALETTE = {
  primary: "#6366f1",
  secondary: "#06b6d4",
  accent: "#f59e0b",
  success: "#10b981",
  muted: "#8b5cf6",
  danger: "#ef4444",
};
const CHART_COLORS = Object.values(PALETTE);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, color }) => (
  <Card>
    <CardContent>
      <div className="kpi-card">
        <div className="kpi-icon" style={{ background: `${color}22`, color }}>
          {icon}
        </div>
        <div>
          <p className="kpi-label">{label}</p>
          <p className="kpi-value" style={{ color }}>
            {value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString?.() ?? p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="analytics-loading">
        <div className="spinner" />
        <p>Cargando dashboard de turismo…</p>
      </div>
    );

  if (error)
    return (
      <div className="analytics-error">
        <p>⚠️ {error}</p>
      </div>
    );

  const { kpis, rating_por_presupuesto, viajes_por_tipo, viajes_por_transporte,
    viajes_por_compania, viajes_por_duracion, distribucion_rating,
    rating_por_tipo, top_planes, clima_preferido } = data;

  return (
    <div className="analytics-page">
      {/* ── Header ── */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">
            <span className="title-accent">Tourism</span> Analytics
          </h1>
          <p className="analytics-subtitle">
            Dataset · Bogotá · {kpis.total_registros.toLocaleString()} registros
          </p>
        </div>
        <div className="header-badge">🗺️ Bogotá, Colombia</div>
      </div>

      {/* ── KPIs ── */}
      <div className="kpi-grid">
        <KpiCard
          label="Total registros"
          value={kpis.total_registros.toLocaleString()}
          icon="📊"
          color={PALETTE.primary}
        />
        <KpiCard
          label="Rating promedio"
          value={`⭐ ${kpis.avg_rating}`}
          icon="⭐"
          color={PALETTE.accent}
        />
        <KpiCard
          label="Planes turísticos"
          value={kpis.total_planes}
          icon="🗺️"
          color={PALETTE.secondary}
        />
        <KpiCard
          label="Tipos de viaje"
          value={kpis.total_tipos_viaje}
          icon="🧳"
          color={PALETTE.success}
        />
      </div>

      {/* ── Row 1: Rating por presupuesto + Tipo de viaje ── */}
      <div className="charts-row">
        <Card className="chart-wide">
          <CardHeader>
            <CardTitle>⭐ Rating promedio por presupuesto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rating_por_presupuesto} barSize={52}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} />
                <YAxis domain={[2.5, 4]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
                  {rating_por_presupuesto.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-wide">
          <CardHeader>
            <CardTitle>🧳 Distribución por tipo de viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={viajes_por_tipo}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {viajes_por_tipo.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Transporte + Compañía + Duración ── */}
      <div className="charts-row-3">
        <Card>
          <CardHeader>
            <CardTitle>🚌 Transporte preferido</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={viajes_por_transporte} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {viajes_por_transporte.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👥 Compañía de viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={viajes_por_compania}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={35}
                  paddingAngle={4}
                >
                  {viajes_por_compania.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🕐 Duración del viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={viajes_por_duracion} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {viajes_por_duracion.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Distribución de rating + Rating por tipo (Radar) ── */}
      <div className="charts-row">
        <Card className="chart-wide">
          <CardHeader>
            <CardTitle>📈 Distribución de ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={distribucion_rating}>
                <defs>
                  <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={PALETTE.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={PALETTE.primary}
                  strokeWidth={2.5}
                  fill="url(#ratingGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-wide">
          <CardHeader>
            <CardTitle>🎯 Rating promedio por tipo de viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={rating_por_tipo} cx="50%" cy="50%" outerRadius={95}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Radar
                  name="Rating"
                  dataKey="rating"
                  stroke={PALETTE.secondary}
                  fill={PALETTE.secondary}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Top planes + Clima ── */}
      <div className="charts-row">
        <Card className="chart-full">
          <CardHeader>
            <CardTitle>🏆 Top 10 planes turísticos más populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top_planes} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={220}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {top_planes.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🌡️ Clima preferido</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clima_preferido}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={6}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {clima_preferido.map((_, i) => (
                    <Cell key={i} fill={[PALETTE.secondary, PALETTE.accent][i % 2]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}