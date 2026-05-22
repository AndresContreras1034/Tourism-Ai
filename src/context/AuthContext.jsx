import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔐 MFA state
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // 🧠 LOAD SESSION
  // =========================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);

    } catch (err) {
      console.error("❌ Error cargando sesión:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // 🔐 LOGIN (STEP 1)
  // =========================
  const login = (data) => {
    if (!data) return null;

    // =========================
    // 🔐 MFA REQUIRED
    // =========================
    if (data.requiresMFA) {
      console.log("🔐 MFA requerido");

      setMfaPending(true);
      setMfaUserId(data.userId);

      return {
        requiresMFA: true,
        userId: data.userId,
      };
    }

    // =========================
    // 🟢 LOGIN NORMAL
    // =========================
    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setMfaPending(false);
      setMfaUserId(null);

      return { success: true };
    }

    console.error("❌ Respuesta inválida login:", data);
    return null;
  };

  // =========================
  // 🔐 COMPLETE MFA LOGIN
  // =========================
  const completeMfaLogin = (data) => {
    if (!data?.token || !data?.user) {
      console.error("❌ MFA inválido:", data);
      return;
    }

    console.log("🟢 MFA LOGIN COMPLETADO");

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setMfaPending(false);
    setMfaUserId(null);
  };

  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    setToken(null);

    setMfaPending(false);
    setMfaUserId(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // =========================
  // 🔐 AUTH STATE (FIX PRINCIPAL)
  // =========================
  const isAuthenticated = !loading && (!!token || !!user);

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

        setUser,
        setToken,

        // 🔐 MFA STATE
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