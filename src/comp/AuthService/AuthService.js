const API_URL = "https://localhost:7086/api/Usuarios";

// Registrar nuevo usuario
export const registrar = async (datos) => {
  const response = await fetch(`${API_URL}/Register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      NombreUsuario: datos.NombreUsuario,
      Email: datos.Email,
      Password: datos.Password || datos.Contraseña,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.text();
};

// ✅ FUNCIÓN DE LOGIN CON DEBUGGING DETALLADO
export const login = async (datos) => {
  try {
    console.log("📤 Enviando datos al servidor:", datos);
    
    const response = await fetch(`${API_URL}/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        NombreUsuario: datos.NombreUsuario,
        Password: datos.Password || datos.Contraseña,
      }),
    });

    console.log("📥 Status de respuesta:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Error del servidor:", error);
      throw new Error(error || "Credenciales inválidas.");
    }

    const data = await response.json();
    
    // ✅ DEBUGGING DETALLADO - Ver estructura exacta
    console.log("🔍 Tipo de data:", typeof data);
    console.log("🔍 Data completa:", data);
    console.log("🔍 JSON.stringify(data):", JSON.stringify(data, null, 2));
    
    // ✅ Verificar cada propiedad individualmente
    console.log("🔍 data.token:", data.token);
    console.log("🔍 data.user:", data.user);
    
    if (data.user) {
      console.log("🔍 data.user.Id:", data.user.Id);
      console.log("🔍 data.user.NombreUsuario:", data.user.NombreUsuario);
      console.log("🔍 data.user.Email:", data.user.Email);
    }

    // ✅ VALIDACIÓN PASO A PASO
    if (!data.token) {
      console.error("❌ No se recibió token");
      console.error("🔍 Propiedades disponibles:", Object.keys(data));
      throw new Error("No se recibió token de autenticación.");
    }

    if (!data.user) {
      console.error("❌ No se recibieron datos de usuario");
      console.error("🔍 Propiedades disponibles:", Object.keys(data));
      throw new Error("No se recibieron datos de usuario.");
    }

    // ✅ Verificar ID con diferentes posibles nombres
    const userId = data.user.Id || data.user.id || data.user.ID;
    if (!userId) {
      console.error("❌ No se recibió ID de usuario");
      console.error("🔍 Propiedades de user:", Object.keys(data.user));
      console.error("🔍 Valores de user:", data.user);
      throw new Error("No se recibió ID de usuario.");
    }

    // ✅ Verificar nombre de usuario con diferentes posibles nombres
    const nombreUsuario = data.user.NombreUsuario || data.user.nombreUsuario || data.user.username;
    if (!nombreUsuario) {
      console.error("❌ No se recibió nombre de usuario");
      console.error("🔍 Propiedades de user:", Object.keys(data.user));
      throw new Error("No se recibió nombre de usuario.");
    }

    // ✅ Guardar datos en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", nombreUsuario);
    localStorage.setItem("usuarioId", userId.toString());
    
    if (data.user.Email || data.user.email) {
      localStorage.setItem("usuarioEmail", data.user.Email || data.user.email);
    }

    console.log("✅ Datos guardados correctamente:", {
      token: "✓ Token guardado",
      usuario: nombreUsuario,
      usuarioId: userId,
      email: data.user.Email || data.user.email || "No disponible"
    });

    return data;
  } catch (err) {
    console.error("❌ Error en login:", err);
    throw err;
  }
};

// Cerrar sesión
export const logout = () => {
  const usuario = getUsuarioAutenticado();
  
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioEmail");
  
  if (usuario) {
    localStorage.removeItem(`carrito_${usuario}`);
    localStorage.removeItem(`favoritos_${usuario}`);
    localStorage.removeItem(`historialCompras_${usuario}`);
    localStorage.removeItem(`configuracionUsuario_${usuario}`);
  }
  
  localStorage.removeItem("carrito");
  localStorage.removeItem("favoritos");
  localStorage.removeItem("historialCompras");
  localStorage.removeItem("configuracionUsuario");
  
  console.log("✅ Sesión cerrada y datos limpiados");
};

// Obtener usuario autenticado
export const getUsuarioAutenticado = () => {
  return localStorage.getItem("usuario");
};

// Obtener token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Obtener ID del usuario
export const getUsuarioId = () => {
  const id = localStorage.getItem("usuarioId");
  return id ? parseInt(id) : null;
};

// Obtener email del usuario
export const getUsuarioEmail = () => {
  return localStorage.getItem("usuarioEmail");
};

// Verificar si el usuario está autenticado
export const estaAutenticado = () => {
  const token = getToken();
  const usuario = getUsuarioAutenticado();
  const usuarioId = getUsuarioId();
  
  return !!(token && usuario && usuarioId);
};

// Verificar si tiene ID de usuario
export const tieneUsuarioId = () => {
  const usuarioId = getUsuarioId();
  return usuarioId !== null && usuarioId > 0;
};

// Obtener todos los datos del usuario actual
export const getDatosUsuarioCompletos = () => {
  return {
    token: getToken(),
    usuario: getUsuarioAutenticado(),
    usuarioId: getUsuarioId(),
    email: getUsuarioEmail(),
    tieneId: tieneUsuarioId(),
    estaAutenticado: estaAutenticado()
  };
};

// Función para debugging
export const verificarEstadoAuth = () => {
  const datos = getDatosUsuarioCompletos();
  console.log("🔍 Estado de autenticación:", datos);
  return datos;
};