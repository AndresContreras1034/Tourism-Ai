export const scorePlans = (plans = [], filters = {}) => {
  if (!plans.length) return [];

  return plans
    .map((plan) => {
      let score = 0;

      // =========================
      // 💰 BUDGET MATCH
      // =========================
      if (plan.profile_match?.budget === filters.budget) {
        score += 30;
      }

      // =========================
      // 🎯 INTERESTS MATCH
      // =========================
      const planInterests = plan.profile_match?.interests || [];
      const userInterests = filters.interests || [];

      const interestMatches = planInterests.filter((i) =>
        userInterests.includes(i)
      ).length;

      score += interestMatches * 20;

      // =========================
      // 👥 COMPANION MATCH
      // =========================
      if (
        plan.profile_match?.companions?.includes(filters.companion)
      ) {
        score += 15;
      }

      // =========================
      // 🧭 TRAVEL STYLE MATCH
      // =========================
      const planStyle = plan.profile_match?.travel_style || [];
      const userStyle = filters.travel_style || [];

      const styleMatches = planStyle.filter((s) =>
        userStyle.includes(s)
      ).length;

      score += styleMatches * 10;

      // =========================
      // ⚠️ SAFETY BONUS / PENALTY
      // =========================
      if (plan.safety?.level === "bajo") {
        score += 10;
      } else if (plan.safety?.level === "alto") {
        score -= 10;
      }

      // =========================
      // 💡 BONUS: PRICE FIT
      // =========================
      if (filters.maxBudget && plan.budget?.estimated_total) {
        if (plan.budget.estimated_total <= filters.maxBudget) {
          score += 20;
        } else {
          score -= 10;
        }
      }

      return {
        ...plan,
        score
      };
    })
    .sort((a, b) => b.score - a.score);
};