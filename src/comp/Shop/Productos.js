const productos = [
  // Calzado
  { Id: 1, Nombre: "Zapatillas Urbanas", Descripcion: "Calzado", Precio: 120000, Stock: 10, Imagen: "/imagenes/imagen1.png" },
  { Id: 2, Nombre: "Tenis Deportivos", Descripcion: "Calzado", Precio: 130000, Stock: 8, Imagen: "/imagenes/imagen2.png" },
  { Id: 3, Nombre: "Botines de Cuero", Descripcion: "Calzado", Precio: 145000, Stock: 6, Imagen: "/imagenes/imagen3.png" },
  { Id: 4, Nombre: "Sandalias Planas", Descripcion: "Calzado", Precio: 68000, Stock: 18, Imagen: "/imagenes/imagen4.png" },
  { Id: 5, Nombre: "Zapatos de Vestir", Descripcion: "Calzado", Precio: 135000, Stock: 4, Imagen: "/imagenes/imagen5.png" },
  { Id: 6, Nombre: "Zapatillas Running", Descripcion: "Calzado", Precio: 125000, Stock: 9, Imagen: "/imagenes/imagen6.png" },
  { Id: 7, Nombre: "Botas de Montaña", Descripcion: "Calzado", Precio: 150000, Stock: 5, Imagen: "/imagenes/imagen7.png" },
  { Id: 8, Nombre: "Mocasines Elegantes", Descripcion: "Calzado", Precio: 98000, Stock: 7, Imagen: "/imagenes/imagen8.png" },
  { Id: 9, Nombre: "Zapatos Náuticos", Descripcion: "Calzado", Precio: 102000, Stock: 6, Imagen: "/imagenes/imagen9.png" },
  { Id: 10, Nombre: "Zapatillas Skate", Descripcion: "Calzado", Precio: 89000, Stock: 10, Imagen: "/imagenes/imagen10.png" },

  // Mujer
  { Id: 11, Nombre: "Blusa Floral", Descripcion: "Mujer", Precio: 85000, Stock: 15, Imagen: "/imagenes/imagen11.png" },
  { Id: 12, Nombre: "Vestido de Verano", Descripcion: "Mujer", Precio: 110000, Stock: 10, Imagen: "/imagenes/imagen12.png" },
  { Id: 13, Nombre: "Falda Plisada", Descripcion: "Mujer", Precio: 78000, Stock: 14, Imagen: "/imagenes/imagen13.png" },
  { Id: 14, Nombre: "Top Deportivo", Descripcion: "Mujer", Precio: 50000, Stock: 16, Imagen: "/imagenes/imagen14.png" },
  { Id: 15, Nombre: "Chaqueta Liviana", Descripcion: "Mujer", Precio: 97000, Stock: 8, Imagen: "/imagenes/imagen15.png" },
  { Id: 16, Nombre: "Pantalón Palazzo", Descripcion: "Mujer", Precio: 88000, Stock: 9, Imagen: "/imagenes/imagen16.png" },
  { Id: 17, Nombre: "Blusa de Encaje", Descripcion: "Mujer", Precio: 92000, Stock: 11, Imagen: "/imagenes/imagen17.png" },
  { Id: 18, Nombre: "Falda Midi", Descripcion: "Mujer", Precio: 79000, Stock: 13, Imagen: "/imagenes/imagen18.png" },
  { Id: 19, Nombre: "Vestido Formal", Descripcion: "Mujer", Precio: 115000, Stock: 6, Imagen: "/imagenes/imagen19.png" },
  { Id: 20, Nombre: "Camiseta Oversize", Descripcion: "Mujer", Precio: 62000, Stock: 12, Imagen: "/imagenes/imagen20.png" },

  // Hombre
  { Id: 21, Nombre: "Camisa Casual", Descripcion: "Hombre", Precio: 95000, Stock: 20, Imagen: "/imagenes/imagen21.png" },
  { Id: 22, Nombre: "Pantalón Chino", Descripcion: "Hombre", Precio: 99000, Stock: 11, Imagen: "/imagenes/imagen22.png" },
  { Id: 23, Nombre: "Camiseta Básica", Descripcion: "Hombre", Precio: 45000, Stock: 22, Imagen: "/imagenes/imagen23.png" },
  { Id: 24, Nombre: "Blazer Elegante", Descripcion: "Hombre", Precio: 160000, Stock: 3, Imagen: "/imagenes/imagen24.png" },
  { Id: 25, Nombre: "Camisa de Lino", Descripcion: "Hombre", Precio: 105000, Stock: 7, Imagen: "/imagenes/imagen25.png" },
  { Id: 26, Nombre: "Jeans Slim Fit", Descripcion: "Hombre", Precio: 87000, Stock: 10, Imagen: "/imagenes/imagen26.png" },
  { Id: 27, Nombre: "Chaqueta Casual", Descripcion: "Hombre", Precio: 112000, Stock: 5, Imagen: "/imagenes/imagen27.png" },
  { Id: 28, Nombre: "Polo Clásico", Descripcion: "Hombre", Precio: 67000, Stock: 14, Imagen: "/imagenes/imagen28.png" },
  { Id: 29, Nombre: "Sudadera Básica", Descripcion: "Hombre", Precio: 78000, Stock: 9, Imagen: "/imagenes/imagen29.png" },
  { Id: 30, Nombre: "Abrigo Largo", Descripcion: "Hombre", Precio: 145000, Stock: 4, Imagen: "/imagenes/imagen30.png" },

  // Juvenil
  { Id: 31, Nombre: "Chaqueta Juvenil", Descripcion: "Juvenil", Precio: 125000, Stock: 7, Imagen: "/imagenes/imagen31.png" },
  { Id: 32, Nombre: "Sudadera Juvenil", Descripcion: "Juvenil", Precio: 105000, Stock: 13, Imagen: "/imagenes/imagen32.png" },
  { Id: 33, Nombre: "Chaqueta Denim", Descripcion: "Juvenil", Precio: 115000, Stock: 5, Imagen: "/imagenes/imagen33.png" },
  { Id: 34, Nombre: "Camiseta Gráfica", Descripcion: "Juvenil", Precio: 52000, Stock: 18, Imagen: "/imagenes/imagen34.png" },
  { Id: 35, Nombre: "Pantalón Jogger", Descripcion: "Juvenil", Precio: 74000, Stock: 10, Imagen: "/imagenes/imagen35.png" },
  { Id: 36, Nombre: "Hoodie Oversize", Descripcion: "Juvenil", Precio: 99000, Stock: 6, Imagen: "/imagenes/imagen36.png" },
  { Id: 37, Nombre: "Short Deportivo", Descripcion: "Juvenil", Precio: 43000, Stock: 12, Imagen: "/imagenes/imagen37.png" },
  { Id: 38, Nombre: "Camisa Estampada", Descripcion: "Juvenil", Precio: 67000, Stock: 11, Imagen: "/imagenes/imagen38.png" },
  { Id: 39, Nombre: "Chaleco Ligero", Descripcion: "Juvenil", Precio: 88000, Stock: 8, Imagen: "/imagenes/imagen39.png" },
  { Id: 40, Nombre: "Parka Juvenil", Descripcion: "Juvenil", Precio: 118000, Stock: 4, Imagen: "/imagenes/imagen40.png" },

  // Accesorios
  { Id: 41, Nombre: "Mochila Escolar", Descripcion: "Accesorios", Precio: 70000, Stock: 12, Imagen: "/imagenes/imagen41.png" },
  { Id: 42, Nombre: "Gorra Estampada", Descripcion: "Accesorios", Precio: 40000, Stock: 25, Imagen: "/imagenes/imagen42.png" },
  { Id: 43, Nombre: "Cartera de Mano", Descripcion: "Accesorios", Precio: 60000, Stock: 9, Imagen: "/imagenes/imagen43.png" },
  { Id: 44, Nombre: "Riñonera Urbana", Descripcion: "Accesorios", Precio: 55000, Stock: 10, Imagen: "/imagenes/imagen44.png" },
  { Id: 45, Nombre: "Bolso Tote", Descripcion: "Accesorios", Precio: 72000, Stock: 7, Imagen: "/imagenes/imagen45.png" },
  { Id: 46, Nombre: "Lentes de Sol", Descripcion: "Accesorios", Precio: 48000, Stock: 14, Imagen: "/imagenes/imagen46.png" },
  { Id: 47, Nombre: "Bufanda de Lana", Descripcion: "Accesorios", Precio: 35000, Stock: 20, Imagen: "/imagenes/imagen47.png" },
  { Id: 48, Nombre: "Cinturón de Cuero", Descripcion: "Accesorios", Precio: 62000, Stock: 11, Imagen: "/imagenes/imagen48.png" },
  { Id: 49, Nombre: "Sombrero de Paja", Descripcion: "Accesorios", Precio: 75000, Stock: 8, Imagen: "/imagenes/imagen49.png" },
  { Id: 50, Nombre: "Pulsera de Cuero", Descripcion: "Accesorios", Precio: 30000, Stock: 15, Imagen: "/imagenes/imagen50.png" }
];

export default productos;
