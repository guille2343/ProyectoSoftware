import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./comp/NavBar/NavBar";
import Login from "./comp/sesion/Login";
import Register from "./comp/Register/Register";
import Inicio from "./comp/inicio/Inicio";
import Contact from "./comp/Contact/Contact";
import Shop from "./comp/Shop/Shop";
import Collection from "./comp/Collection/Collection";
import Footer from "./comp/Footer/Footer";

function App() {
  const [usuario, setUsuario] = useState(null);

  // Al montar el componente, intenta cargar el usuario desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombreUsuario = localStorage.getItem("usuario");
    console.log("Verificando usuario al cargar:", { token, nombreUsuario }); // 🔍 Debug
    
    if (token && nombreUsuario) {
      setUsuario(nombreUsuario);
      console.log("Usuario cargado:", nombreUsuario); // 🔍 Debug
    }
  }, []);

  // ✅ MEJORADO: Maneja el login exitoso con logs
  const handleLogin = (nombreUsuario) => {
    console.log("handleLogin llamado con:", nombreUsuario); // 🔍 Debug
    setUsuario(nombreUsuario);
    console.log("Estado de usuario actualizado a:", nombreUsuario); // 🔍 Debug
  };

  // Maneja el logout
  const handleLogout = () => {
    console.log("handleLogout llamado"); // 🔍 Debug
    
    // Limpiar TODOS los datos del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("carrito");
    localStorage.removeItem("favoritos");
    localStorage.removeItem("historialCompras");
    localStorage.removeItem("configuracionUsuario");
    
    // Limpiar el estado local
    setUsuario(null);
    
    console.log("Sesión cerrada y datos limpiados"); // 🔍 Debug
  };

  console.log("Estado actual del usuario en App:", usuario); // 🔍 Debug

  return (
    <Router>
      <div className="App">
        <Navbar usuario={usuario} onLogout={handleLogout} />

        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/" element={<Inicio />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;