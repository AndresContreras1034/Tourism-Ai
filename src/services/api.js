const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("🌐 [API INIT]", API_URL);

/**
 * =========================
 * 🔐 TOKEN READER
 * =========================
 */
const getToken = () => {
  const token = localStorage.getItem("token");

  console.log("🔑 TOKEN EN LOCALSTORAGE:");
  console.log(token);

  console.log("📦 LOCALSTORAGE COMPLETO:");
  console.log({
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user"),
    tempToken: localStorage.getItem("tempToken"),
    mfaTemp: sessionStorage.getItem("mfa_tempToken"),
    mfaUser: sessionStorage.getItem("mfa_userId"),
  });

  return token;
};

/**
 * =========================
 * 🔐 HEADERS
 * =========================
 */
const getHeaders = (
  isFormData = false,
  requireAuth = false
) => {
  const token = getToken();

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
  };

  if (requireAuth) {
    console.log(
      "🟡 AUTH REQUERIDO → token:",
      token
    );

    if (token) {
      headers.Authorization = `Bearer ${token}`;

      console.log(
        "🟢 AUTH HEADER ENVIADO:",
        headers.Authorization.slice(0, 40) + "..."
      );
    } else {
      console.log("🔴 NO HAY TOKEN");
    }
  }

  return headers;
};

/**
 * =========================
 * ⏱️ FETCH
 * =========================
 */
const fetchWithTimeout = async (
  url,
  options,
  timeout = 15000
) => {
  const controller =
    new AbortController();

  const id = setTimeout(
    () => controller.abort(),
    timeout
  );

  try {
    console.log(
      "🌐 [REQUEST]",
      {
        url,
        method:
          options?.method,
        body:
          options?.body,
      }
    );

    const res = await fetch(url, {
      ...options,
      signal:
        controller.signal,
    });

    console.log(
      "📡 [STATUS]",
      res.status
    );

    return res;
  } catch (err) {
    console.error(
      "❌ NETWORK ERROR",
      err
    );

    throw new Error(
      "Error de red o timeout"
    );
  } finally {
    clearTimeout(id);
  }
};

/**
 * =========================
 * 📦 RESPONSE
 * =========================
 */
const handleResponse =
  async (response) => {
    const text =
      await response.text();

    let data;

    try {
      data = text
        ? JSON.parse(text)
        : null;
    } catch {
      data = text;
    }

    console.log(
      "📦 [RAW RESPONSE]",
      {
        status:
          response.status,
        ok: response.ok,
        data,
      }
    );

    if (!response.ok) {
      console.error(
        "❌ API ERROR",
        data
      );

      throw new Error(
        `HTTP ${response.status} - ${
          data?.message ||
          "Error request"
        }`
      );
    }

    console.log(
      "✅ SUCCESS",
      data
    );

    return data;
  };

/**
 * =========================
 * 🌐 METHODS
 * =========================
 */

export const get = async (
  endpoint,
  requireAuth = true
) => {
  const res =
    await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: "GET",
        headers:
          getHeaders(
            false,
            requireAuth
          ),
      }
    );

  return handleResponse(res);
};

export const post = async (
  endpoint,
  body,
  requireAuth = true
) => {
  const res =
    await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: "POST",
        headers:
          getHeaders(
            false,
            requireAuth
          ),
        body:
          JSON.stringify(
            body
          ),
      }
    );

  return handleResponse(res);
};

export const patch = async (
  endpoint,
  body,
  requireAuth = true
) => {
  const res =
    await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: "PATCH",
        headers:
          getHeaders(
            false,
            requireAuth
          ),
        body:
          JSON.stringify(
            body
          ),
      }
    );

  return handleResponse(res);
};

/**
 * =========================
 * 👤 USER
 * =========================
 */

export const getCurrentUser =
  async () => {
    console.log(
      "👤 GET USER"
    );

    return get(
      "/users",
      true
    );
  };

export const updateUser =
  async (data) => {
    console.log(
      "👤 UPDATE USER",
      data
    );

    return patch(
      "/users",
      data,
      true
    );
  };

/**
 * =========================
 * 🌍 PROFILE
 * =========================
 */

export const saveUserProfile =
  async (data) => {
    console.log(
      "🌍 SAVE PROFILE",
      data
    );

    return post(
      "/profiles",
      data,
      true
    );
  };

export const getUserProfile =
  async () => {
    console.log(
      "🌍 GET PROFILE"
    );

    return get(
      "/profiles",
      true
    );
  };

export const updateUserProfile =
  async (data) => {
    console.log(
      "🌍 UPDATE PROFILE",
      data
    );

    return patch(
      "/profiles",
      data,
      true
    );
  };

/**
 * =========================
 * 📸 AVATAR
 * =========================
 */

export const uploadAvatar =
  async (file) => {
    const token =
      getToken();

    const formData =
      new FormData();

    formData.append(
      "avatar",
      file
    );

    const res =
      await fetchWithTimeout(
        `${API_URL}/users/avatar`,
        {
          method: "POST",
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {},
          body:
            formData,
        }
      );

    return handleResponse(
      res
    );
  };

/**
 * =========================
 * EXPORT DEFAULT
 * =========================
 */

export default API_URL;