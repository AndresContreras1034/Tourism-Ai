const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * 🔐 LOGIN
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  // 💾 persistencia básica (solo si login normal)
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * 🧾 REGISTER
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * 🔐 MFA SETUP (🔥 ESTE ES EL QUE TE FALTABA)
 * Genera QR + secret
 */
export const setupMfa = async (token) => {
  const response = await fetch(`${API_URL}/mfa/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error generando MFA setup");
  }

  return data;
};

/**
 * 🔐 VERIFY MFA LOGIN
 */
export const verifyMfaLogin = async ({ userId, token }) => {
  const response = await fetch(`${API_URL}/auth/verify-mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error verificando MFA");
  }

  // 💾 sesión final (DESPUÉS del MFA)
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * 🚪 LOGOUT
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};