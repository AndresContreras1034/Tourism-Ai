const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * 🔐 Obtener token seguro
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * 🔐 Headers centralizados
 */
const getHeaders = (isFormData = false, requireAuth = false) => {
  const token = getToken();

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * ⏱️ FETCH CON TIMEOUT
 */
const fetchWithTimeout = async (url, options, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return res;
  } catch (err) {
    console.error("❌ NETWORK/TIMEOUT ERROR:", err.message);
    throw new Error("Error de red o timeout");
  } finally {
    clearTimeout(id);
  }
};

/**
 * 📦 RESPONSE HANDLER
 */
const handleResponse = async (response) => {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error("❌ ERROR RESPONSE:", response.status, data);

    if (response.status === 401) {
      console.warn("🚨 TOKEN INVÁLIDO O AUSENTE");
    }

    throw new Error(
      `HTTP ${response.status} - ${data?.message || "Error en request"}`
    );
  }

  return data;
};

/**
 * =========================
 * 🌐 BASE METHODS
 * =========================
 */

export const get = async (endpoint, requireAuth = true) => {
  const token = getToken();

  console.log("➡️ GET:", endpoint);
  console.log("🔐 TOKEN:", token);

  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(false, requireAuth),
  });

  return handleResponse(res);
};

export const post = async (endpoint, body, requireAuth = true) => {
  const token = getToken();

  console.log("➡️ POST:", endpoint);
  console.log("🔐 TOKEN:", token);

  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(false, requireAuth),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
};

export const patch = async (endpoint, body, requireAuth = true) => {
  const token = getToken();

  console.log("➡️ PATCH:", endpoint);
  console.log("🔐 TOKEN:", token);

  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(false, requireAuth),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
};

/**
 * =========================
 * 👤 USER
 * =========================
 */

export const getCurrentUser = async () => {
  return await get("/user", true);
};

export const updateUser = async (data) => {
  return await patch("/user", data, true);
};

/**
 * =========================
 * 🌍 PROFILE
 * =========================
 */

export const saveUserProfile = async (data) => {
  return await post("/profile", data, true);
};

export const getUserProfile = async () => {
  return await get("/profile", true);
};

export const updateUserProfile = async (data) => {
  return await patch("/profile", data, true);
};

/**
 * =========================
 * 🧠 RECOMMENDATIONS
 * =========================
 */

export const getRecommendations = async (filters, plans = []) => {
  const scored = plans.map((plan) => {
    let score = 0;

    if (plan.profile_match?.budget === filters.budget) score += 3;

    const matchInterest =
      plan.profile_match?.interests?.filter((i) =>
        filters.interests?.includes(i)
      )?.length || 0;

    score += matchInterest * 5;

    if (plan.profile_match?.companions?.includes(filters.companion)) {
      score += 2;
    }

    if (plan.safety?.level === "bajo") score += 3;

    return { ...plan, score };
  });

  return scored.sort((a, b) => b.score - a.score);
};

/**
 * =========================
 * 📸 AVATAR
 * =========================
 */

export const uploadAvatar = async (file) => {
  const token = getToken();

  console.log("➡️ UPLOAD AVATAR");

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetchWithTimeout(`${API_URL}/user/avatar`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return handleResponse(res);
};