const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("🌐 [API INIT]", API_URL);

/* =========================================================
   🔐 TOKEN GLOBAL (SOURCE OF TRUTH)
========================================================= */
const getToken = () => {
  const contextToken = window.__TOKEN__;
  const storageToken = localStorage.getItem("token");

  const token = contextToken || storageToken;

  console.log("🔑 TOKEN RESUELTO:", token);

  return token;
};

/* =========================================================
   🔐 HEADERS
========================================================= */
const getHeaders = (isFormData = false, requireAuth = false) => {
  const token = getToken();

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
  };

  if (requireAuth) {
    if (!token || token === "null" || token === "undefined") {
      console.error("❌ REQUEST BLOQUEADO: No hay token válido");
      throw new Error("No authenticated session");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/* =========================================================
   ⏱️ FETCH WRAPPER
========================================================= */
const fetchWithTimeout = async (url, options, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    console.log("🌐 [REQUEST]", {
      url,
      method: options?.method,
    });

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    console.log("📡 [STATUS]", res.status);

    return res;
  } catch (err) {
    console.error("❌ NETWORK ERROR", err);
    throw new Error("Error de red o timeout");
  } finally {
    clearTimeout(id);
  }
};

/* =========================================================
   📦 RESPONSE HANDLER
========================================================= */
const handleResponse = async (response) => {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log("📦 [RAW RESPONSE]", {
    status: response.status,
    ok: response.ok,
    data,
  });

  if (!response.ok) {
    console.error("❌ API ERROR", data);

    throw new Error(
      `HTTP ${response.status} - ${data?.message || "Error request"}`
    );
  }

  return data;
};

/* =========================================================
   🌐 METHODS
========================================================= */
export const get = async (endpoint, requireAuth = true) => {
  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(false, requireAuth),
  });

  return handleResponse(res);
};

export const post = async (endpoint, body, requireAuth = true) => {
  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(false, requireAuth),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
};

export const patch = async (endpoint, body, requireAuth = true) => {
  const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(false, requireAuth),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
};

/* =========================================================
   👤 USER
========================================================= */
export const getCurrentUser = async () => {
  return get("/users", true);
};

export const updateUser = async (data) => {
  return patch("/users", data, true);
};

/* =========================================================
   🌍 PROFILE
========================================================= */
export const saveUserProfile = async (data) => {
  return post("/profiles", data, true);
};

export const getUserProfile = async () => {
  return get("/profiles", true);
};

export const updateUserProfile = async (data) => {
  return patch("/profiles", data, true);
};

/* =========================================================
   📸 AVATAR
========================================================= */
export const uploadAvatar = async (file) => {
  const token = getToken();

  if (!token) {
    throw new Error("No authenticated session");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetchWithTimeout(`${API_URL}/users/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(res);
};

/* =========================================================
   EXPORT
========================================================= */
export default API_URL;