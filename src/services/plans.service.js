// services/plans.service.js

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";


// =====================================================
// 🔌 BASE REQUEST HELPER
// =====================================================
const request = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...(options.headers || {}),
      },

      ...options,
    });

    // =====================================================
    // ❌ ERROR HANDLING
    // =====================================================
    if (!response.ok) {
      let errorMessage = "API Error";

      try {
        const errorData = await response.json();

        errorMessage =
          errorData?.message ||
          errorData?.detail ||
          errorMessage;

      } catch {
        errorMessage = await response.text();
      }

      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error) {
    console.error("❌ API REQUEST ERROR:", error.message);
    throw error;
  }
};


// =====================================================
// 🧠 OBTENER RECOMENDACIONES REALES
// =====================================================
export const getRecommendedPlans = async (filters = {}) => {
  try {
    console.log("🚀 Fetching recommendations");

    const response = await request(
      "/plans/recommendations",
      {
        method: "POST",
        body: JSON.stringify(filters),
      }
    );

    console.log("🟢 Recommendations received");

    return {
      recommendations:
        response?.data?.recommendations || [],

      bestMatch:
        response?.data?.bestMatch || null,
    };

  } catch (error) {
    console.error(
      "❌ getRecommendedPlans ERROR:",
      error.message
    );

    return {
      recommendations: [],
      bestMatch: null,
    };
  }
};


// =====================================================
// 📦 OBTENER TODOS LOS PLANES
// =====================================================
export const getAllPlans = async () => {
  try {
    const response = await request("/plans");

    return response?.data || [];

  } catch (error) {
    console.error(
      "❌ getAllPlans ERROR:",
      error.message
    );

    return [];
  }
};


// =====================================================
// 📍 OBTENER PLAN POR ID
// =====================================================
export const getPlanById = async (id) => {
  try {
    const response = await request(`/plans/${id}`);

    return response?.data || null;

  } catch (error) {
    console.error(
      "❌ getPlanById ERROR:",
      error.message
    );

    return null;
  }
};


// =====================================================
// ⭐ GUARDAR FAVORITO
// =====================================================
export const saveFavoritePlan = async (
  planId
) => {
  try {
    const response = await request(
      "/plans/favorite",
      {
        method: "POST",
        body: JSON.stringify({ planId }),
      }
    );

    return response;

  } catch (error) {
    console.error(
      "❌ saveFavoritePlan ERROR:",
      error.message
    );

    throw error;
  }
};