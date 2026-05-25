import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  console.log("🔥 [AUTH PROVIDER] RENDER");

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [mfaPending, setMfaPending] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     🧠 INIT SESSION (SOLO UNA VEZ)
  ========================================================= */
  useEffect(() => {
    console.log("🚀 [AUTH INIT] START");

    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("📦 STORAGE RAW:", { storedUser, storedToken });

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken && storedToken !== "undefined") {
        setToken(storedToken);
      }

    } catch (err) {
      console.error("❌ AUTH INIT ERROR", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      console.log("✅ [AUTH INIT DONE]");
    }
  }, []);

  /* =========================================================
     🔄 GLOBAL SYNC (🔥 CLAVE PARA NAVBAR + MFA)
  ========================================================= */
  const syncSession = useCallback(() => {
    console.log("🔄 SYNC SESSION");

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  /* =========================================================
     🔐 LOGIN NORMAL
  ========================================================= */
  const login = (data) => {
    console.log("🚨 LOGIN INPUT:", data);

    if (!data) return null;

    if (data.requiresMFA) {
      setMfaPending(true);
      setMfaUserId(data.userId);

      return { requiresMFA: true, userId: data.userId };
    }

    const finalToken =
      data.token ||
      data.accessToken ||
      data?.data?.token;

    const finalUser =
      data.user ||
      data?.data?.user;

    if (!finalToken || !finalUser) {
      console.error("❌ LOGIN INVALID FORMAT");
      return null;
    }

    setUser(finalUser);
    setToken(finalToken);

    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", finalToken);

    setMfaPending(false);
    setMfaUserId(null);

    console.log("🟢 LOGIN OK");
    return { success: true };
  };

  /* =========================================================
     🔐 MFA COMPLETE LOGIN (🔥 FIX DEFINITIVO)
  ========================================================= */
  const completeMfaLogin = (data) => {
    console.log("🚨 MFA COMPLETE RAW:", data);

    const finalToken =
      data.token ||
      data.accessToken ||
      data?.data?.token;

    const finalUser =
      data.user ||
      data?.data?.user;

    // 🔥 fallback crítico (evita desync total)
    if (!finalToken || !finalUser) {
      console.warn("⚠️ MFA sin payload → usando localStorage fallback");

      const fallbackUser = localStorage.getItem("user");
      const fallbackToken = localStorage.getItem("token");

      if (fallbackUser && fallbackToken) {
        setUser(JSON.parse(fallbackUser));
        setToken(fallbackToken);
        return;
      }

      return;
    }

    setUser(finalUser);
    setToken(finalToken);

    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", finalToken);

    setMfaPending(false);
    setMfaUserId(null);

    console.log("🟢 MFA LOGIN SYNC OK");
  };

  /* =========================================================
     🚪 LOGOUT
  ========================================================= */
  const logout = () => {
    console.log("🚪 LOGOUT");

    setUser(null);
    setToken(null);

    setMfaPending(false);
    setMfaUserId(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    console.log("🧹 SESSION CLEARED");
  };

  const isAuthenticated = !loading && !!token;

  console.log("📊 AUTH STATE:", {
    user,
    token,
    loading,
    isAuthenticated,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        login,
        logout,
        completeMfaLogin,

        syncSession, // 🔥 opcional pero útil

        isAuthenticated,
        loading,

        setUser,
        setToken,

        mfaPending,
        mfaUserId,
        setMfaPending,
        setMfaUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}