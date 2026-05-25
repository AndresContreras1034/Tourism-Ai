import "./Marketplace.css";
import PlanCard from "./PlanCard";

/**
 * 📭 Empty state
 */
function EmptyState() {
  return (
    <div className="empty-state">
      <p>No hay planes disponibles</p>
    </div>
  );
}

/**
 * 📊 Header simple (sin useMemo innecesario)
 */
function ResultsHeader({ count }) {
  let label = "Sin resultados";

  if (count === 1) label = "1 resultado encontrado";
  else if (count > 1) label = `${count} resultados encontrados`;

  return (
    <div className="marketplace-header">
      <h2>Planes recomendados</h2>
      <p>{label}</p>
    </div>
  );
}

/**
 * 🧭 Marketplace (UI only)
 * - Sin mock
 * - Sin lógica de negocio
 * - Solo render
 */
export default function Marketplace({
  plans = [],
  loading = false,
  onSelectPlan,
}) {
  return (
    <div className="marketplace">

      <ResultsHeader count={plans.length} />

      <div className="marketplace-grid">

        {loading && (
          <p>Cargando planes...</p>
        )}

        {!loading && plans.length === 0 && (
          <EmptyState />
        )}

        {!loading && plans.length > 0 && (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => onSelectPlan?.(plan)}
            />
          ))
        )}

      </div>
    </div>
  );
}