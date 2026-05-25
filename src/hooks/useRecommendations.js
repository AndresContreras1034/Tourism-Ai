import { useEffect, useState, useMemo } from "react";

/**
 * 🧠 Hook de recomendaciones (FRONTEND CLEAN)
 * Solo consume API futura de backend
 */
const recommendationsApi = {
  async getRecommendations(filters) {
    throw new Error("Backend not connected yet");
  }
};

export const useRecommendations = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await recommendationsApi.getRecommendations(filters);

        setData(response?.recommendations || []);
      } catch (err) {
        setError("No se pudieron cargar recomendaciones");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [filters]);

  /**
   * 🏆 Top 3 (UI convenience only)
   */
  const topRecommendations = useMemo(() => {
    return data.slice(0, 3);
  }, [data]);

  /**
   * 📊 Best match (#1)
   */
  const bestMatch = useMemo(() => {
    return data[0] || null;
  }, [data]);

  return {
    recommendations: data,
    topRecommendations,
    bestMatch,
    loading,
    error
  };
};