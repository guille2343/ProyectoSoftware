import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  getUsuarioAutenticado, 
  getUsuarioId, 
  getToken, 
  estaAutenticado,
  tieneUsuarioId,
  verificarEstadoAuth 
} from "../AuthService/AuthService";
import "./Collection.css";

const Collection = () => {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Verificar autenticación básica
    if (!estaAutenticado()) {
      alert("Debes iniciar sesión para ver tu carrito.");
      navigate("/login");
      return;
    }

    const user = getUsuarioAutenticado();
    const userId = getUsuarioId();
    
    setUsuario(user);
    setUsuarioId(userId);

    // ✅ Debug completo del estado
    verificarEstadoAuth();

    const userCart = JSON.parse(localStorage.getItem(`carrito_${user}`)) || [];
    const carritoConvertido = userCart.map((p) => ({
      ...p,
      cantidad: parseInt(p.cantidad) || 1,
      Precio: parseFloat(p.Precio) || 0,
    }));
    setCarrito(carritoConvertido);
  }, [navigate]);

  const actualizarCantidad = (index, delta) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad += delta;
    if (nuevoCarrito[index].cantidad < 1) nuevoCarrito[index].cantidad = 1;
    setCarrito(nuevoCarrito);
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(nuevoCarrito));
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(nuevoCarrito));
  };

  const calcularTotal = () =>
    carrito.reduce(
      (total, p) => total + parseFloat(p.Precio) * parseInt(p.cantidad),
      0
    );

  const manejarPago = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // ✅ Verificar si tenemos ID de usuario para el pago
    if (!tieneUsuarioId()) {
      alert("⚠️ No se puede procesar el pago sin ID de usuario.\n\nPor favor:\n1. Cierra sesión\n2. Vuelve a iniciar sesión\n3. Intenta nuevamente");
      return;
    }

    setMostrarResumen(true);
  };

  const confirmarPago = async () => {
    if (!metodoPago || !numeroTarjeta) {
      alert("Por favor, selecciona un método de pago y completa los detalles.");
      return;
    }

    if (numeroTarjeta.length < 16) {
      alert("El número de tarjeta debe tener 16 dígitos.");
      return;
    }

    // ✅ Verificaciones antes de proceder
    if (!estaAutenticado()) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      navigate("/login");
      return;
    }

    if (!tieneUsuarioId()) {
      alert("❌ Error: No se puede procesar el pago sin ID de usuario.\n\nPor favor contacta al soporte técnico.");
      return;
    }

    setCargando(true);
    const token = getToken();

    try {
      console.log("🚀 Iniciando proceso de pago...");
      console.log("👤 Usuario:", usuario);
      console.log("🆔 Usuario ID:", usuarioId);

      // ✅ PASO 1: Crear método de pago
      console.log("📝 Creando método de pago...");
      const metodoPagoResponse = await axios.post(
        "https://localhost:7086/api/MetodosPago",
        {
          Tipo: metodoPago,
          Detalles: numeroTarjeta,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const metodoPagoId = metodoPagoResponse.data.id;
      console.log("✅ Método de pago creado con ID:", metodoPagoId);

      // ✅ PASO 2: Crear la orden
      console.log("📦 Creando orden...");
      const ordenData = {
        Fecha: new Date().toISOString(),
        Total: calcularTotal(),
        UsuarioId: usuarioId,
        MetodoPagoId: metodoPagoId,
      };

      console.log("📋 Datos de la orden:", ordenData);

      const ordenResponse = await axios.post(
        "https://localhost:7086/api/Ordenes",
        ordenData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const ordenId = ordenResponse.data.id;
      console.log("✅ Orden creada con ID:", ordenId);

      // ✅ PASO 3: Crear detalles de la orden
      console.log("📋 Creando detalles de la orden...");
      for (const producto of carrito) {
        const detalleData = {
          OrdenId: ordenId,
          ProductoId: producto.Id,
          Cantidad: producto.cantidad,
          Precio: producto.Precio,
        };

        console.log(`📝 Creando detalle para producto ${producto.Nombre}:`, detalleData);

        await axios.post(
          "https://localhost:7086/api/DetallesOrden",
          detalleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`✅ Detalle creado para producto: ${producto.Nombre}`);
      }

      // ✅ PASO 4: Éxito
      console.log("🎉 ¡Orden completada exitosamente!");
      
      localStorage.removeItem(`carrito_${usuario}`);
      setCarrito([]);
      setMostrarResumen(false);
      setMetodoPago("");
      setNumeroTarjeta("");
      
      alert(`¡Pago confirmado! 🎉\nOrden #${ordenId}\nGracias por tu compra.`);
      navigate("/shop");

    } catch (error) {
      console.error("❌ Error en el proceso de pago:", error);
      
      if (error.response) {
        console.error("📄 Respuesta del servidor:", error.response.data);
        console.error("🔢 Status:", error.response.status);
        
        if (error.response.status === 401) {
          alert("❌ No autorizado. Por favor, inicia sesión de nuevo.");
          navigate("/login");
        } else if (error.response.status === 400) {
          alert(`❌ Error en los datos: ${error.response.data.message || error.response.data}`);
        } else {
          alert(`❌ Error del servidor: ${error.response.data.message || 'Error interno'}`);
        }
      } else if (error.request) {
        alert("❌ No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        alert("❌ Error inesperado. Intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="collection-container">
      <h2>🛒 Tu Carrito</h2>

      {/* ✅ Mostrar advertencia si no hay ID de usuario */}
      {estaAutenticado() && !tieneUsuarioId() && (
        <div className="advertencia-usuario-id">
          <p>⚠️ <strong>Advertencia:</strong> No se detectó ID de usuario. El carrito funciona, pero el pago puede no estar disponible.</p>
          <button onClick={() => navigate("/login")} className="btn-relogin">
            🔄 Volver a iniciar sesión
          </button>
        </div>
      )}

      {carrito.length === 0 && !mostrarResumen ? (
        <div className="mensaje-vacio">
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate("/shop")} className="btn-volver">
            🛍️ Ir a la tienda
          </button>
        </div>
      ) : (
        <>
          {!mostrarResumen ? (
            <>
              <div className="carrito-lista">
                {carrito.map((producto, index) => (
                  <div key={index} className="producto-carrito">
                    <img src={producto.Imagen || "/placeholder.svg"} alt={producto.Nombre} />
                    <div className="info">
                      <h4>{producto.Nombre}</h4>
                      <p>{producto.Descripcion}</p>
                      <p className="precio">${producto.Precio.toLocaleString()}</p>
                      
                      <div className="cantidad-container">
                        <span className="cantidad-label">Cantidad:</span>
                        <div className="cantidad-controles">
                          <button 
                            className="btn-cantidad menos"
                            onClick={() => actualizarCantidad(index, -1)}
                          >
                            −
                          </button>
                          <span className="cantidad-numero">{producto.cantidad}</span>
                          <button 
                            className="btn-cantidad mas"
                            onClick={() => actualizarCantidad(index, 1)}
                          >
                            +
                          </button>
                          <button 
                            className="btn-eliminar" 
                            onClick={() => eliminarProducto(index)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pago">
                <p className="total-final">Total: ${calcularTotal().toLocaleString()}</p>
                <button 
                  onClick={manejarPago} 
                  className="btn-proceder"
                  disabled={!tieneUsuarioId()} // ✅ Deshabilitar si no hay ID
                >
                  {tieneUsuarioId() ? "💳 Proceder al Pago" : "❌ Pago no disponible"}
                </button>
              </div>
            </>
          ) : (
            <div className="resumen-orden">
              <h3>📦 Resumen de la Orden</h3>
              <div className="info-orden">
                <p><strong>📅 Fecha:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>👤 Usuario:</strong> {usuario}</p>
                <p><strong>💰 Total:</strong> ${calcularTotal().toLocaleString()}</p>
              </div>

              <div className="metodo-pago-section">
                <label htmlFor="metodoPago">💳 Método de Pago:</label>
                <select
                  id="metodoPago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona un método --</option>
                  <option value="Tarjeta de crédito">💳 Tarjeta de crédito</option>
                  <option value="Tarjeta de débito">💳 Tarjeta de débito</option>
                </select>

                <label htmlFor="numeroTarjeta">🔢 Número de tarjeta:</label>
                <input
                  id="numeroTarjeta"
                  type="text"
                  value={numeroTarjeta}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '');
                    if (valor.length <= 16) {
                      setNumeroTarjeta(valor);
                    }
                  }}
                  maxLength={16}
                  placeholder="1234567890123456"
                  required
                />
                <small>🔒 Información segura y encriptada</small>
              </div>

              <div className="detalles-productos">
                <h4>🧾 Detalles de Productos</h4>
                <ul>
                  {carrito.map((p, i) => (
                    <li key={i}>
                      <strong>{p.Nombre}</strong> - 
                      Cantidad: {p.cantidad} - 
                      Unitario: ${p.Precio.toLocaleString()} - 
                      Subtotal: ${(p.Precio * p.cantidad).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="botones-accion">
                <button 
                  onClick={() => setMostrarResumen(false)}
                  className="btn-volver"
                  disabled={cargando}
                >
                  ⬅️ Volver al carrito
                </button>
                <button 
                  onClick={confirmarPago}
                  className="btn-confirmar"
                  disabled={cargando || !metodoPago || !numeroTarjeta}
                >
                  {cargando ? "⏳ Procesando..." : "✅ Confirmar Pago"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Collection;