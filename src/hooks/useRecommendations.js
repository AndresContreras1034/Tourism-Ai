import { useMemo } from "react";
import { scorePlans } from "../core/scoringEngine";
import plans from "../data/plans.json";

/**
 * 🧠 Hook principal de recomendaciones
 * Conecta:
 * - Filters del usuario
 * - Plans JSON
 * - Scoring engine
 */
export const useRecommendations = (filters = {}) => {
  const recommendations = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return plans; // fallback: muestra todo si no hay filtros
    }

    const scoredPlans = scorePlans(plans, filters);

    return scoredPlans;
  }, [filters]);

  /**
   * 🏆 Top 3 (para UI tipo “wow”)
   */
  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 3);
  }, [recommendations]);

  /**
   * 📊 Best match (el #1)
   */
  const bestMatch = useMemo(() => {
    return recommendations[0] || null;
  }, [recommendations]);

  return {
    recommendations,
    topRecommendations,
    bestMatch
  };
};