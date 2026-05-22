const API_URL = "http://localhost:3000/reviews";

// =========================
// 📥 GET ALL REVIEWS
// =========================
export const getReviews = async () => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Error fetching reviews");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getReviews error:", error);
    return [];
  }
};

// =========================
// 📤 CREATE REVIEW
// =========================
export const createReview = async (review) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!res.ok) {
      throw new Error("Error creating review");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("createReview error:", error);
    return null;
  }
};