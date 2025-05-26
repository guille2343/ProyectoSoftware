import React, { useState, useEffect } from 'react';
import axios from 'axios';
import productos from './Productos';
import { getToken } from '../AuthService/AuthService';
import './Shop.css';

const categorias = ['Todos', 'Calzado', 'Mujer', 'Hombre', 'Juvenil', 'Accesorios'];

const Shop = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [productosDB, setProductosDB] = useState([]);
  const [cargandoSincronizacion, setCargandoSincronizacion] = useState(false);
  const [sincronizacionCompleta, setSincronizacionCompleta] = useState(false);
  const [mapeoIds, setMapeoIds] = useState({});

  // ✅ Función para eliminar productos duplicados
  const eliminarDuplicados = (productos) => {
    const productosUnicos = [];
    const productosVistos = new Set();

    productos.forEach(producto => {
      const clave = `${(producto.Nombre || producto.nombre)}_${(producto.Descripcion || producto.descripcion)}`;
      
      if (!productosVistos.has(clave)) {
        productosVistos.add(clave);
        productosUnicos.push(producto);
      }
    });

    return productosUnicos;
  };

  // ✅ Función para normalizar la ruta de imagen
  const normalizarRutaImagen = (rutaImagen) => {
    if (!rutaImagen) return "/placeholder.svg";
    
    // Si ya es una ruta absoluta o placeholder, devolverla tal como está
    if (rutaImagen.startsWith('http') || rutaImagen.startsWith('/placeholder')) {
      return rutaImagen;
    }
    
    // Si la ruta ya incluye /imagenes/, usarla directamente
    if (rutaImagen.includes('/imagenes/')) {
      return rutaImagen;
    }
    
    // Si es solo el nombre del archivo, agregar la ruta completa
    if (!rutaImagen.startsWith('/')) {
      return `/imagenes/${rutaImagen}`;
    }
    
    return rutaImagen;
  };

  // ✅ Función para obtener imagen del producto local
  const obtenerImagenProducto = (producto) => {
    // Buscar el producto en el archivo local por ID primero, luego por nombre
    const productoLocal = productos.find(p => 
      p.Id === (producto.Id || producto.id) ||
      (p.Nombre === (producto.Nombre || producto.nombre) && p.Descripcion === (producto.Descripcion || producto.descripcion))
    );
    
    if (productoLocal?.Imagen) {
      return normalizarRutaImagen(productoLocal.Imagen);
    }
    
    return "/placeholder.svg";
  };

  // ✅ Función para combinar datos de BD con imágenes locales
  const combinarProductosConImagenes = (productosDB) => {
    const productosConImagenes = productosDB.map(productoDB => ({
      ...productoDB,
      Imagen: obtenerImagenProducto(productoDB)
    }));
    
    // ✅ Eliminar duplicados después de combinar
    return eliminarDuplicados(productosConImagenes);
  };

  // ✅ Función para obtener mapeo de IDs
  const obtenerMapeoIds = async () => {
    try {
      const response = await axios.get('https://localhost:7086/api/Productos/MapeoIds');
      if (response.data.success) {
        setMapeoIds(response.data.mapeo);
      }
    } catch (error) {
      console.error("Error obteniendo mapeo:", error);
    }
  };

  // ✅ Función para sincronizar productos con la base de datos
  const sincronizarProductos = async () => {
    try {
      setCargandoSincronizacion(true);
      
      const productosParaSincronizar = productos.map(p => ({
        Id: p.Id,
        Nombre: p.Nombre,
        Descripcion: p.Descripcion,
        Precio: p.Precio,
        Stock: p.Stock
      }));

      const response = await axios.post(
        'https://localhost:7086/api/Productos/Sincronizar',
        productosParaSincronizar,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000
        }
      );
      
      if (response.data.success) {
        setSincronizacionCompleta(true);
        
        if (response.data.mapeoIds) {
          setMapeoIds(response.data.mapeoIds);
        }
        
        await cargarProductosDB();
        await obtenerMapeoIds();
      } else {
        throw new Error(response.data.message || 'Error en sincronización');
      }
      
    } catch (error) {
      console.error("Error en sincronización:", error);
      // Fallback: usar productos del archivo local con imágenes normalizadas
      const productosConImagenes = productos.map(p => ({
        ...p,
        Imagen: normalizarRutaImagen(p.Imagen)
      }));
      // ✅ Eliminar duplicados en el fallback también
      setProductosDB(eliminarDuplicados(productosConImagenes));
      setSincronizacionCompleta(true);
    } finally {
      setCargandoSincronizacion(false);
    }
  };

  // ✅ Función para cargar productos desde la base de datos
  const cargarProductosDB = async () => {
    try {
      const response = await axios.get('https://localhost:7086/api/Productos');
      
      // ✅ Combinar datos de BD con imágenes locales y eliminar duplicados
      const productosConImagenes = combinarProductosConImagenes(response.data);
      setProductosDB(productosConImagenes);
      
    } catch (error) {
      console.error("Error al cargar productos de BD:", error);
      // Fallback: usar productos del archivo con imágenes normalizadas
      const productosConImagenes = productos.map(p => ({
        ...p,
        Imagen: normalizarRutaImagen(p.Imagen)
      }));
      // ✅ Eliminar duplicados en el fallback también
      setProductosDB(eliminarDuplicados(productosConImagenes));
    }
  };

  // ✅ Verificar sincronización al cargar el componente
  useEffect(() => {
    const inicializar = async () => {
      try {
        setCargandoSincronizacion(true);
        
        const response = await axios.get('https://localhost:7086/api/Productos/VerificarSincronizacion');

        if (response.data.success) {
          if (response.data.necesitaSincronizacion) {
            await sincronizarProductos();
          } else {
            await cargarProductosDB();
            await obtenerMapeoIds();
            setSincronizacionCompleta(true);
          }
        } else {
          throw new Error(response.data.message || 'Error en verificación');
        }
      } catch (error) {
        console.error("Error al verificar sincronización:", error);
        // Fallback: usar productos del archivo con imágenes normalizadas
        const productosConImagenes = productos.map(p => ({
          ...p,
          Imagen: normalizarRutaImagen(p.Imagen)
        }));
        // ✅ Eliminar duplicados en el fallback también
        setProductosDB(eliminarDuplicados(productosConImagenes));
        setSincronizacionCompleta(true);
      } finally {
        setCargandoSincronizacion(false);
      }
    };

    inicializar();
  }, []);

  // ✅ Función para obtener ID real del producto
  const obtenerIdReal = (producto) => {
    const clave = `${producto.Nombre}_${producto.Descripcion}`;
    return mapeoIds[clave] || producto.Id || producto.id;
  };

  // ✅ Usar productos de la base de datos si están disponibles, sino del archivo
  const productosParaMostrar = productosDB.length > 0 ? productosDB : eliminarDuplicados(productos.map(p => ({
    ...p,
    Imagen: normalizarRutaImagen(p.Imagen)
  })));

  // ✅ Filtrado mejorado que maneja diferentes formatos de propiedades
  const productosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? productosParaMostrar
      : productosParaMostrar.filter(p => {
          const categoria = p.Descripcion || p.descripcion || '';
          return categoria === categoriaSeleccionada;
        });

  const agregarAlCarrito = (producto) => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    const carritoKey = `carrito_${usuario}`;
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

    // ✅ Usar ID real de la base de datos
    const idReal = obtenerIdReal(producto);

    // ✅ Asegurar que el producto tenga la estructura correcta con imagen normalizada
    const productoParaCarrito = {
      Id: idReal,
      Nombre: producto.Nombre || producto.nombre,
      Descripcion: producto.Descripcion || producto.descripcion,
      Precio: producto.Precio || producto.precio,
      Stock: producto.Stock || producto.stock,
      Imagen: producto.Imagen || normalizarRutaImagen(obtenerImagenProducto(producto)),
      cantidad: 1
    };

    const indexExistente = carrito.findIndex(p => p.Id === productoParaCarrito.Id);
    if (indexExistente !== -1) {
      carrito[indexExistente].cantidad += 1;
    } else {
      carrito.push(productoParaCarrito);
    }

    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    alert(`${producto.Nombre || producto.nombre || 'Producto'} agregado al carrito.`);
  };

  // ✅ Mostrar loading durante sincronización
  if (cargandoSincronizacion) {
    return (
      <div className="shop-container">
        <div className="sincronizacion-loading">
          <h2>Cargando productos...</h2>
          <p>Preparando la tienda, esto tomará solo unos segundos.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-main">
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            {categorias.map(cat => (
              <li
                key={cat}
                className={cat === categoriaSeleccionada ? 'activo' : ''}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <main className="productos-grid">
          {productosFiltrados.map(producto => (
            <div key={producto.Id || producto.id} className="card">
              <img 
                src={producto.Imagen || normalizarRutaImagen(obtenerImagenProducto(producto))} 
                alt={producto.Nombre || producto.nombre}
                onError={(e) => {
                  console.log(`Error cargando imagen: ${e.target.src}`);
                  e.target.src = "/placeholder.svg";
                }}
                onLoad={(e) => {
                  console.log(`Imagen cargada exitosamente: ${e.target.src}`);
                }}
              />
              <h4>{producto.Nombre || producto.nombre}</h4>
              <p className="categoria">{producto.Descripcion || producto.descripcion}</p>
              <p className="precio">${(producto.Precio || producto.precio).toLocaleString()}</p>
              <p className="stock">Stock: {producto.Stock || producto.stock}</p>
              <button onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Shop;