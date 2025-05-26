import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import "./Inicio.css";
import InicioImagen from "../imagenes/InicioImagen.png";

const Inicio = () => {
  return (
    <div className="inicio">
      <header
        className="hero"
        style={{ backgroundImage: `url(${InicioImagen})` }}
      >
        <div className="hero-content">
          <h3>Elegance-Comfort</h3>
          <h1>KNITTED DRESS</h1>
          <p>30% Off At Your First Order</p>
          <Link to="/shop" className="shop-btn">Shop Now</Link>
        </div>
      </header>
    </div>
  );
};

export default Inicio;