import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  /* =========================================================
     🔐 STATE
  ========================================================= */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [mfaPending, setMfaPending] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);

  /* =========================================================
     🧠 INIT SESSION
  ========================================================= */
  useEffect(() => {
    console.log("🚀 [AUTH INIT] START");

    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const parsedUser =
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null;

      const parsedToken =
        storedToken && storedToken !== "undefined"
          ? storedToken
          : null;

      setUser(parsedUser);
      setToken(parsedToken);

      console.log("📦 [AUTH INIT] RESTORED:", {
        user: !!parsedUser,
        token: !!parsedToken,
      });
    } catch (err) {
      console.error("❌ [AUTH INIT ERROR]", err);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      console.log("✅ [AUTH INIT DONE]");
    }
  }, []);

  /* =========================================================
     🔄 GLOBAL SYNC (IMPORTANTE PARA NAVBAR)
  ========================================================= */
  const syncSession = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    setUser(
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null
    );

    setToken(
      storedToken && storedToken !== "undefined"
        ? storedToken
        : null
    );

    console.log("🔄 [AUTH SYNC] SESSION UPDATED");
  }, []);

  /* =========================================================
     🔐 LOGIN
  ========================================================= */
  const login = async (credentials) => {
    console.log("🚀 [LOGIN START]", credentials);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      console.log("📨 [LOGIN RESPONSE]", {
        status: res.status,
        data,
      });

      /* =========================
         🔥 MFA FLOW
      ========================= */
      if (data?.requiresMFA) {
        console.log("🔐 [MFA REQUIRED]");

        setMfaPending(true);
        setMfaUserId(data.userId);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return {
          requiresMFA: true,
          userId: data.userId,
        };
      }

      const finalToken = data?.token;
      const finalUser = data?.user;

      if (!finalToken || !finalUser) {
        console.error("❌ [LOGIN INVALID RESPONSE]", data);
        throw new Error("Invalid login response");
      }

      setUser(finalUser);
      setToken(finalToken);

      localStorage.setItem("user", JSON.stringify(finalUser));
      localStorage.setItem("token", finalToken);

      setMfaPending(false);
      setMfaUserId(null);

      console.log("🟢 [LOGIN SUCCESS]");

      return {
        success: true,
        user: finalUser,
        token: finalToken,
      };
    } catch (err) {
      console.error("❌ [LOGIN ERROR]", err);
      throw err;
    }
  };

  /* =========================================================
     🔐 MFA COMPLETE
  ========================================================= */
  const completeMfaLogin = (data) => {
    console.log("🚨 [MFA COMPLETE]", data);

    const finalToken = data?.token || data?.accessToken;
    const finalUser = data?.user;

    if (!finalToken || !finalUser) {
      console.error("❌ [MFA INVALID RESPONSE]", data);
      throw new Error("Invalid MFA response");
    }

    setUser(finalUser);
    setToken(finalToken);

    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", finalToken);

    setMfaPending(false);
    setMfaUserId(null);

    console.log("🟢 [MFA SUCCESS] SESSION READY");

    return { success: true };
  };

  /* =========================================================
     🚪 LOGOUT
  ========================================================= */
  const logout = () => {
    console.log("🚪 [LOGOUT]");

    setUser(null);
    setToken(null);

    setMfaPending(false);
    setMfaUserId(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    console.log("🧹 [SESSION CLEARED]");
  };

  /* =========================================================
     🧪 AUTH STATE
  ========================================================= */
  const isAuthenticated = !!token && !loading;

  console.log("📊 [AUTH STATE]", {
    user: !!user,
    token: !!token,
    loading,
    isAuthenticated,
    mfaPending,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        login,
        logout,
        completeMfaLogin,

        isAuthenticated,
        loading,

        mfaPending,
        mfaUserId,

        syncSession, // 🔥 clave para navbar / refresh manual

        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}