import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import "./BudgetChart.css";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];
const BUDGET_COLORS = { alto: "#10b981", medio: "#f59e0b", economico: "#6366f1" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bc-tooltip">
      <p className="bc-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>{typeof p.value === "number" && p.value < 100 ? p.value.toFixed(2) : p.value?.toLocaleString("es-CO")}</strong>
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, span }) => (
  <div className={`bc-card ${span === 2 ? "bc-card--wide" : ""}`}>
    <div className="bc-card__head">
      <p className="bc-card__title">{title}</p>
      {subtitle && <p className="bc-card__sub">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default function BudgetChart({ data }) {
  if (!data) return <div className="bc-skeleton" />;

  const {
    rating_por_presupuesto,
    distribucion_rating,
    rating_por_tipo,
    top_planes,
  } = data;

  return (
    <div className="bc-grid">

      {/* ── Rating por presupuesto – bar con colores semánticos ── */}
      <ChartCard title="💰 Rating por presupuesto" subtitle="promedio ★ por categoría">
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={rating_por_presupuesto} barSize={52}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 13, textTransform: "capitalize" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[2.5, 4]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff06" }} />
            <Bar dataKey="rating" name="Rating" radius={[10, 10, 0, 0]}>
              {rating_por_presupuesto?.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={BUDGET_COLORS[entry.name] ?? COLORS[0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Radar rating por tipo ── */}
      <ChartCard title="🎯 Rating por tipo de viaje" subtitle="satisfacción comparada">
        <ResponsiveContainer width="100%" height={230}>
          <RadarChart data={rating_por_tipo} cx="50%" cy="50%" outerRadius={85}>
            <PolarGrid stroke="#1a2740" />
            <PolarAngleAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Radar
              name="Rating"
              dataKey="rating"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Distribución de ratings – area ── */}
      <ChartCard title="📊 Distribución de ratings" subtitle="concentración de puntuaciones">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={distribucion_rating} margin={{ right: 8 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name="Registros"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#a5b4fc" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Top 10 planes – horizontal bar wide ── */}
      <ChartCard title="🏆 Top 10 planes más populares" subtitle="por número de registros" span={2}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top_planes} layout="vertical" barSize={20} margin={{ left: 8, right: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              width={210}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff06" }} />
            <Bar dataKey="value" name="Registros" radius={[0, 8, 8, 0]}>
              {top_planes?.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}