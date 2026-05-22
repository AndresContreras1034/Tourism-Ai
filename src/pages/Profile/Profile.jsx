import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import useAuth from "../../hooks/useAuth";

// 🔥 SERVICES
import {
  getCurrentUser,
  getProfile,
  updateUser,
  updateProfile,
} from "../../services/profile.service";

// 🔥 upload
import { uploadAvatar } from "../../services/api";

export default function Profile() {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [editing, setEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [avatar, setAvatar] = useState(null);

  // 🔁 cargar datos SIN botarte de la sesión
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Cargando usuario...");

        const userData = await getCurrentUser();
        console.log("🟢 USER:", userData);

        setUser(userData);

        setForm({
          name: userData.name || "",
          email: userData.email || "",
        });

        setAvatar(userData.avatar || null);

        // 🔸 perfil no es crítico (no rompe si falla)
        try {
          const profile = await getProfile();
          setProfileData(profile);
        } catch (err) {
          console.warn("⚠️ No se pudo cargar profile", err);
        }

      } catch (err) {
console.error("❌ Error cargando usuario");
console.log("ERROR COMPLETO:", err);
console.log("MENSAJE:", err.message);
        // 🚨 SOLO redirige si es realmente auth
        if (err.message?.includes("401")) {
          logout();
          navigate("/login");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 📸 subir avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatar(preview);

    try {
      const res = await uploadAvatar(file);
      const avatarUrl = res.data.avatar;

      setAvatar(avatarUrl);

      const updatedUser = await getCurrentUser();
      setUser(updatedUser);

    } catch (err) {
      console.error("❌ Error subiendo avatar", err);
    }
  };

  // 💾 guardar
  const handleSave = async () => {
    try {
      await updateUser({
        name: form.name,
        email: form.email,
      });

      if (profileData) {
        await updateProfile(profileData);
      }

      const updatedUser = await getCurrentUser();
      setUser(updatedUser);

      setEditing(false);

    } catch (err) {
      console.error("❌ Error guardando perfil", err);
    }
  };

  // 🌀 loading controlado
  if (loading || pageLoading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-content">
          <p>Cargando perfil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-content">
          <p>No se pudo cargar el usuario</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar user={user} />

      <main className="profile-content">
        <div className="profile-card">

          {/* HEADER */}
          <div className="profile-header">
            <h1>Mi perfil</h1>

            <div className="profile-avatar">
              <img
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="avatar"
                className="avatar-img"
              />

              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="profile-section">
            <h3>Información personal</h3>

            <div className="profile-field">
              <label>Nombre</label>
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Correo</label>
              {editing ? (
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
          </div>

          {/* PERFIL */}
          {profileData && (
            <div className="profile-section">
              <h3>Perfil de viajero</h3>

              <p><strong>Ciudad:</strong> {profileData.origin_city}</p>
              <p><strong>Presupuesto:</strong> {profileData.budget}</p>
              <p><strong>Tipo:</strong> {profileData.travel_type}</p>
              <p><strong>Compañía:</strong> {profileData.companions}</p>
              <p><strong>Duración:</strong> {profileData.duration}</p>

              <button
                className="edit-btn"
                onClick={() => navigate("/onboarding")}
              >
                Editar preferencias
              </button>
            </div>
          )}

          {/* INTERESES */}
          {profileData?.interests?.length > 0 && (
            <div className="profile-section">
              <h3>Intereses</h3>

              <div className="tags-container">
                {profileData.interests.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEGURIDAD */}
          <div className="profile-section">
            <h3>Seguridad</h3>

            <p>
              MFA:{" "}
              {profileData?.mfa_enabled ? (
                <span style={{ color: "green" }}>Activado</span>
              ) : (
                <span style={{ color: "red" }}>No activado</span>
              )}
            </p>

            <button
              className="edit-btn"
              onClick={() => console.log("MFA próximamente")}
            >
              Configurar autenticación en 2 pasos
            </button>
          </div>

          {/* ACCIONES */}
          <div className="profile-actions">

            {editing ? (
              <>
                <button className="save-btn" onClick={handleSave}>
                  Guardar
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}