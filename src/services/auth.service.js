const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("🌐 [AUTH SERVICE INIT] API_URL =", API_URL);

/* =========================================================
   🧠 SESSION HELPERS (COMPATIBLE CON AuthContext)
========================================================= */
export const getSession = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  console.log("🧠 SESSION CHECK →", {
    hasUser: !!user,
    hasToken: !!token,
  });

  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
  };
};

export const clearSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  sessionStorage.removeItem("mfa_userId");
  sessionStorage.removeItem("mfa_tempToken");

  console.log("🚪 SESSION LIMPIADA");
};

/* =========================================================
   🧠 SAFE RESPONSE PARSER
========================================================= */
const parseResponse = async (response) => {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.warn("⚠️ Response no es JSON:");
    console.warn(text);
    data = { raw: text };
  }

  console.log("📦 [RESPONSE DEBUG]", {
    url: response.url,
    status: response.status,
    ok: response.ok,
    data,
  });

  return data;
};

/* =========================================================
   🔐 LOGIN
========================================================= */
export const loginUser = async (credentials) => {
  console.log("🚀 LOGIN REQUEST →", credentials);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  // 🔐 MFA FLOW
  if (data?.requiresMFA) {
    console.log("🔐 MFA REQUIRED");

    if (data.userId) {
      sessionStorage.setItem("mfa_userId", data.userId);
    }

    return data;
  }

  const token =
    data?.token ||
    data?.accessToken ||
    data?.data?.token;

  if (!token || !data?.user) {
    throw new Error("Respuesta inválida del login");
  }

  // 🔥 GUARDAR SESIÓN (CLAVE PARA TU NAVBAR)
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", token);

  console.log("🟢 LOGIN OK → SESSION GUARDADA");

  return data;
};

/* =========================================================
   🧾 REGISTER
========================================================= */
export const registerUser = async (userData) => {
  console.log("🧾 REGISTER REQUEST →", userData);

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  const token =
    data?.token ||
    data?.accessToken ||
    data?.data?.token;

  if (token && data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", token);

    console.log("🟢 REGISTER OK → SESSION GUARDADA");
  }

  return data;
};

/* =========================================================
   🔐 VERIFY MFA
========================================================= */
export const verifyMfaLogin = async ({ userId, token }) => {
  console.log("🚨 VERIFY MFA →", { userId, token });

  const response = await fetch(`${API_URL}/auth/verify-mfa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Error verificando MFA");
  }

  const finalToken =
    data?.token ||
    data?.accessToken ||
    data?.data?.token;

  if (!finalToken || !data?.user) {
    throw new Error("Respuesta MFA inválida");
  }

  // 🔥 GUARDAR SESIÓN FINAL
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", finalToken);

  sessionStorage.removeItem("mfa_userId");
  sessionStorage.removeItem("mfa_tempToken");

  console.log("🟢 MFA COMPLETADO → SESSION OK");

  return data;
};

/* =========================================================
   🚪 LOGOUT
========================================================= */
export const logoutUser = () => {
  clearSession();
};