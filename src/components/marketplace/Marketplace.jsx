import { useMemo } from "react";
import "./Marketplace.css";
import PlanCard from "./PlanCard";

function EmptyState() {
  return (
    <div className="empty-state">
      <p>No hay planes disponibles</p>
    </div>
  );
}

function ResultsHeader({ count }) {
  const label = useMemo(() => {
    if (count === 0) return "Sin resultados";
    if (count === 1) return "1 resultado encontrado";
    return `${count} resultados encontrados`;
  }, [count]);

  return (
    <div className="marketplace-header">
      <h2>Planes recomendados</h2>
      <p>{label}</p>
    </div>
  );
}

export default function Marketplace({
  plans = [],
  loading = false,
  onSelectPlan,
}) {
  const hasPlans = plans.length > 0;

  return (
    <div className="marketplace">
      <ResultsHeader count={plans.length} />

      <div className="marketplace-grid">
        {loading ? (
          // 🔄 Estado loading (puedes meter skeletons luego)
          <p>Cargando planes...</p>
        ) : hasPlans ? (
          plans.map((plan) => (
            <PlanCard
              key={plan.id || `${plan.name}-${plan.location}`}
              plan={plan}
              onClick={() => onSelectPlan?.(plan)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}