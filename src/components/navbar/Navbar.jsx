import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

import logo from "../../assets/logo1.png";
import tokenImg from "../../assets/token.png";

import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const firstName = user?.name?.split(" ")[0] || "Usuario";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-logo" onClick={() => handleNavigate("/")}>
          <img src={logo} alt="logo" className="navbar-logo-img" />
          <h2>Tourism-ai</h2>
        </div>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => handleNavigate("/")}
          >
            Inicio
          </li>

          {user && (
            <>
              <li
                className={location.pathname.startsWith("/plans") ? "active" : ""}
                onClick={() => handleNavigate("/plans")}
              >
                Planes
              </li>
              <li
                className={location.pathname === "/profile" ? "active" : ""}
                onClick={() => handleNavigate("/profile")}
              >
                Perfil
              </li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {user && (
            <div className="navbar-tokens">
              <img src={tokenImg} alt="tokens" className="token-icon" />
              <span className="token-count">{user?.tokens ?? 2}</span>
            </div>
          )}

          {!user ? (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
              <button className="btn-register" onClick={() => navigate("/register")}>
                Registrarme
              </button>
            </>
          ) : (
            <div className="navbar-user">
              <span className="user-name">👋 Hola, {firstName}</span>
              <button className="btn-logout" onClick={logout}>Salir</button>
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

      </div>
    </nav>
  );
}