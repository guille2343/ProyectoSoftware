import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ usuario, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    onLogout();
    
    // Navegar al inicio
    navigate("/inicio");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        {usuario ? (
          <span className="user-welcome">
            👤 {usuario}
          </span>
        ) : (
          <span className="guest-message">
            🔐 Inicie sesión
          </span>
        )}
      </div>

      <ul className="nav-links">
        <li><Link to="/inicio">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/collection">Collection</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="auth-buttons">
        {usuario ? (
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        ) : (
          <div className="guest-actions">
            <Link to="/login" className="login-btn">Iniciar Sesión</Link>
            <Link to="/register" className="register-btn">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;