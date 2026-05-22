const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Obtener planes recomendados (con IA + filtros)
 */
export const getRecommendedPlans = async (filters) => {
  try {
    const response = await fetch(`${API_URL}/plans/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error("Error al obtener planes recomendados");
    }

    return await response.json();
  } catch (error) {
    console.error("Plans error:", error);
    throw error;
  }
};

/**
 * Obtener todos los planes
 */
export const getAllPlans = async () => {
  try {
    const response = await fetch(`${API_URL}/plans`);

    if (!response.ok) {
      throw new Error("Error al obtener planes");
    }

    return await response.json();
  } catch (error) {
    console.error("Plans error:", error);
    throw error;
  }
};

/**
 * Obtener detalle de un plan por ID
 */
export const getPlanById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/plans/${id}`);

    if (!response.ok) {
      throw new Error("Error al obtener el plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Plans error:", error);
    throw error;
  }
};

/**
 * (Opcional) guardar plan favorito
 */
export const saveFavoritePlan = async (planId, token) => {
  try {
    const response = await fetch(`${API_URL}/plans/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      throw new Error("Error al guardar favorito");
    }

    return await response.json();
  } catch (error) {
    console.error("Favorite error:", error);
    throw error;
  }
};