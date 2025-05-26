import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ AGREGADO: Import de Link
import { registrar } from "../AuthService/AuthService";

const Register = () => {
  const [formulario, setFormulario] = useState({
    NombreUsuario: "",
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      await registrar(formulario);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={manejarEnvio} className="register-form">
        <h2>Registro</h2>
        
        <input
          type="text"
          name="NombreUsuario"
          placeholder="Usuario"
          value={formulario.NombreUsuario}
          onChange={manejarCambio}
          required
        />
        
        <input
          type="email"
          name="Email"
          placeholder="Correo"
          value={formulario.Email}
          onChange={manejarCambio}
          required
        />
        
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          value={formulario.Password}
          onChange={manejarCambio}
          required
        />
        
        <button type="submit">Registrarse</button>

        {/* Enlace de vuelta al login */}
        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;