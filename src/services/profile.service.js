// src/services/profile.service.js

import {
  getCurrentUser as apiGetCurrentUser,
  updateUser as apiUpdateUser,
  getUserProfile,
  updateUserProfile,
} from "./api";

/**
 * ==================================================
 * 👤 USER (datos básicos)
 * ==================================================
 */

// 🔥 Obtener usuario actual
export const getCurrentUser = async () => {
  try {
    const res = await apiGetCurrentUser();

    // tu backend: { success, data }
    if (!res || !res.data) {
      throw new Error("Usuario inválido");
    }

    return res.data;
  } catch (err) {
    console.error("❌ getCurrentUser:", err);
    throw err?.message || "Error obteniendo usuario";
  }
};

// 🔥 Actualizar usuario (name, email, avatar)
export const updateUser = async (data) => {
  try {
    const res = await apiUpdateUser(data);

    if (!res || !res.data) {
      throw new Error("Error actualizando usuario");
    }

    return res.data;
  } catch (err) {
    console.error("❌ updateUser:", err);
    throw err?.message || "Error actualizando usuario";
  }
};

/**
 * ==================================================
 * 🌍 PROFILE (onboarding)
 * ==================================================
 */

// 🔥 Obtener perfil de viajero
export const getProfile = async () => {
  try {
    const res = await getUserProfile();

    // backend: { success, data }
    if (!res || !res.data) {
      throw new Error("Perfil inválido");
    }

    return res.data;
  } catch (err) {
    console.error("❌ getProfile:", err);
    throw err?.message || "Error obteniendo perfil";
  }
};

// 🔥 Actualizar perfil onboarding
export const updateProfile = async (data) => {
  try {
    const res = await updateUserProfile(data);

    if (!res || !res.data) {
      throw new Error("Error actualizando perfil");
    }

    return res.data;
  } catch (err) {
    console.error("❌ updateProfile:", err);
    throw err?.message || "Error actualizando perfil";
  }
};

/**
 * ==================================================
 * 🔐 MFA (placeholder seguro)
 * ==================================================
 */

export const setupMfa = async () => {
  console.warn("⚠️ MFA no implementado aún");
  return null;
};

export const verifyMfa = async () => {
  console.warn("⚠️ MFA no implementado aún");
  return null;
};

export const validateMfaLogin = async () => {
  console.warn("⚠️ MFA no implementado aún");
  return null;
};

export const disableMfa = async () => {
  console.warn("⚠️ MFA no implementado aún");
  return null;
};