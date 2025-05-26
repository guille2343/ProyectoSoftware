import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contacto - Fleeked</h2>
      <p>
        Bienvenido a Fleeked, tu tienda virtual favorita de ropa y accesorios de moda.  
        Nos dedicamos a ofrecer productos exclusivos, de alta calidad y con diseños únicos que reflejan tu estilo personal.
      </p>
      <p>
        En Fleeked, creemos que la moda es una forma de expresión, por eso trabajamos para que cada prenda y accesorio que encuentres aquí te inspire a destacar y sentirte increíble.
      </p>
      <h3>Información de contacto</h3>
      <ul>
        <li><strong>Dirección:</strong> Avenida Moda 456, Centro Comercial Fashion, Ciudad Estilo</li>
        <li><strong>Teléfono:</strong> +1 (555) 987-6543</li>
        <li><strong>Email:</strong> contacto@fleeked.com</li>
        <li><strong>Horario de atención:</strong> Lunes a Sábado, 10:00 am - 8:00 pm</li>
      </ul>
      <h3>Redes Sociales</h3>
      <ul className="social-links">
        <li><a href="https://instagram.com/fleeked" target="_blank" rel="noreferrer">Instagram</a></li>
        <li><a href="https://facebook.com/fleeked" target="_blank" rel="noreferrer">Facebook</a></li>
        <li><a href="https://twitter.com/fleeked" target="_blank" rel="noreferrer">Twitter</a></li>
      </ul>
      <p>
        Gracias por elegir Fleeked para renovar tu guardarropa. ¡Estamos aquí para ayudarte a lucir siempre a la moda!
      </p>
    </div>
  );
};

export default Contact;
