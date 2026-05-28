import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import "./UsersChart.css";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="uc-tooltip">
      <p className="uc-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>{p.value?.toLocaleString("es-CO")}</strong>
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, children, span }) => (
  <div className={`uc-card ${span === 2 ? "uc-card--wide" : ""}`}>
    <p className="uc-card__title">{title}</p>
    {children}
  </div>
);

export default function UsersChart({ data }) {
  if (!data) return <div className="uc-skeleton" />;

  const {
    viajes_por_tipo,
    viajes_por_compania,
    viajes_por_transporte,
    viajes_por_duracion,
  } = data;

  return (
    <div className="uc-grid">

      {/* ── Tipo de viaje – horizontal bar ── */}
      <ChartCard title="🧳 Viajes por tipo" span={2}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={viajes_por_tipo} layout="vertical" barSize={18} margin={{ left: 8, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" width={96} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="value" name="Registros" radius={[0, 8, 8, 0]}>
              {viajes_por_tipo?.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Compañía – donut ── */}
      <ChartCard title="👥 Compañía de viaje">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={viajes_por_compania}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius={82}
              innerRadius={40}
              paddingAngle={4}
              strokeWidth={0}
            >
              {viajes_por_compania?.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Transporte – vertical bar ── */}
      <ChartCard title="🚌 Transporte preferido">
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={viajes_por_transporte} barSize={32} margin={{ bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="value" name="Registros" radius={[8, 8, 0, 0]}>
              {viajes_por_transporte?.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Duración – donut ── */}
      <ChartCard title="🕐 Duración del viaje">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={viajes_por_duracion}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius={82}
              innerRadius={40}
              paddingAngle={4}
              strokeWidth={0}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {viajes_por_duracion?.map((_, i) => (
                <Cell key={i} fill={[COLORS[2], COLORS[0], COLORS[3]][i % 3]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}