import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../AuthService/AuthService"; // Asegúrate de que la ruta sea correcta
import "./Login.css";

const Login = ({ onLogin }) => {
  const [formulario, setFormulario] = useState({ NombreUsuario: "", Password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Datos del formulario:", formulario); // 🔍 Debug

    try {
      const resultado = await login(formulario);
      console.log("Resultado completo del login:", resultado); // 🔍 Debug
      
      // ✅ CORREGIDO: Verificar diferentes formas de acceder al nombre
      let nombreUsuario = null;
      
      if (resultado.user) {
        // Intentar diferentes propiedades
        nombreUsuario = resultado.user.NombreUsuario || 
                      resultado.user.nombreUsuario || 
                      resultado.user.username ||
                      resultado.user.name;
      }
      
      console.log("Nombre de usuario extraído:", nombreUsuario); // 🔍 Debug
      
      if (nombreUsuario && onLogin) {
        onLogin(nombreUsuario);
        console.log("onLogin llamado con:", nombreUsuario); // 🔍 Debug
      } else {
        console.error("No se pudo extraer el nombre de usuario o onLogin no está definido");
      }
      
      // Navegar al inicio después del login exitoso
      navigate("/inicio");
      
    } catch (err) {
      console.error("Error en login:", err); // 🔍 Debug
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={manejarEnvio} className="login-form">
        <h2>Iniciar Sesión</h2>

        <div className="form-group">
          <input
            type="text"
            name="NombreUsuario"
            placeholder="Nombre de Usuario"
            value={formulario.NombreUsuario}
            onChange={manejarCambio}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="Password"
            placeholder="Contraseña"
            value={formulario.Password}
            onChange={manejarCambio}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Iniciando sesión..." : "Entrar"}
        </button>

        {error && <p className="error-message">{error}</p>}
        
        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;