using BackFleeked.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackFleeked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly ContextDB _context;

        public ProductosController(ContextDB context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound();

            return producto;
        }

        // ✅ SOLUCIÓN ALTERNATIVA: Sincronizar sin manipular Identity
        [HttpPost("Sincronizar")]
        public async Task<IActionResult> SincronizarProductos([FromBody] List<ProductoSincronizacionDTO> productosDto)
        {
            try
            {
                Console.WriteLine($"🔄 Iniciando sincronización de {productosDto.Count} productos...");

                var productosActualizados = 0;
                var productosCreados = 0;
                var mapeoIds = new Dictionary<int, int>(); // Mapeo ID original -> ID BD

                foreach (var productoDto in productosDto)
                {
                    try
                    {
                        // ✅ Buscar producto por nombre y descripción (no por ID)
                        var productoExistente = await _context.Productos
                            .FirstOrDefaultAsync(p => p.Nombre == productoDto.Nombre &&
                                                    p.Descripcion == productoDto.Descripcion);

                        if (productoExistente != null)
                        {
                            // ✅ Actualizar producto existente
                            productoExistente.Precio = productoDto.Precio;
                            productoExistente.Stock = productoDto.Stock;

                            _context.Entry(productoExistente).State = EntityState.Modified;
                            productosActualizados++;

                            // ✅ Guardar mapeo
                            mapeoIds[productoDto.Id] = productoExistente.Id;

                            Console.WriteLine($"📝 Actualizado: {productoDto.Nombre} (Original ID: {productoDto.Id} -> BD ID: {productoExistente.Id})");
                        }
                        else
                        {
                            // ✅ Crear nuevo producto (sin especificar ID, dejar que EF lo genere)
                            var nuevoProducto = new Producto
                            {
                                // NO especificamos Id, EF lo generará automáticamente
                                Nombre = productoDto.Nombre,
                                Descripcion = productoDto.Descripcion,
                                Precio = productoDto.Precio,
                                Stock = productoDto.Stock
                            };

                            _context.Productos.Add(nuevoProducto);
                            await _context.SaveChangesAsync(); // ✅ Guardar inmediatamente para obtener el ID

                            productosCreados++;

                            // ✅ Guardar mapeo
                            mapeoIds[productoDto.Id] = nuevoProducto.Id;

                            Console.WriteLine($"➕ Creado: {productoDto.Nombre} (Original ID: {productoDto.Id} -> BD ID: {nuevoProducto.Id})");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error procesando producto {productoDto.Nombre}: {ex.Message}");
                        // Continuar con el siguiente producto
                    }
                }

                // ✅ Guardar cambios finales
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Sincronización completada: {productosCreados} creados, {productosActualizados} actualizados");

                return Ok(new
                {
                    message = "Productos sincronizados exitosamente",
                    productosCreados,
                    productosActualizados,
                    totalProcesados = productosDto.Count,
                    mapeoIds, // ✅ Devolver el mapeo de IDs
                    success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en sincronización: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    message = "Error al sincronizar productos",
                    error = ex.Message,
                    innerException = ex.InnerException?.Message,
                    success = false
                });
            }
        }

        // ✅ NUEVO: Verificar si la base de datos tiene productos
        [HttpGet("VerificarSincronizacion")]
        public async Task<IActionResult> VerificarSincronizacion()
        {
            try
            {
                var cantidadProductos = await _context.Productos.CountAsync();
                var necesitaSincronizacion = cantidadProductos < 50; // ✅ Cambiar lógica

                Console.WriteLine($"📊 Verificación: {cantidadProductos} productos en BD");

                return Ok(new
                {
                    cantidadProductos,
                    necesitaSincronizacion,
                    message = necesitaSincronizacion
                        ? $"La base de datos tiene {cantidadProductos} productos, se requiere sincronización"
                        : $"Base de datos contiene {cantidadProductos} productos - sincronización completa",
                    success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al verificar sincronización: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error al verificar sincronización",
                    error = ex.Message,
                    success = false
                });
            }
        }

        // ✅ NUEVO: Obtener mapeo de IDs para el frontend
        [HttpGet("MapeoIds")]
        public async Task<IActionResult> ObtenerMapeoIds()
        {
            try
            {
                var productos = await _context.Productos.ToListAsync();
                var mapeo = new Dictionary<string, int>();

                foreach (var producto in productos)
                {
                    // ✅ Crear clave única basada en nombre y descripción
                    var clave = $"{producto.Nombre}_{producto.Descripcion}";
                    mapeo[clave] = producto.Id;
                }

                return Ok(new
                {
                    mapeo,
                    totalProductos = productos.Count,
                    success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error obteniendo mapeo: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error obteniendo mapeo de IDs",
                    error = ex.Message,
                    success = false
                });
            }
        }

        // ✅ NUEVO: Limpiar todos los productos (para testing)
        [HttpDelete("LimpiarTodos")]
        public async Task<IActionResult> LimpiarTodosLosProductos()
        {
            try
            {
                Console.WriteLine("🗑️ Limpiando todos los productos...");

                var productos = await _context.Productos.ToListAsync();
                _context.Productos.RemoveRange(productos);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ {productos.Count} productos eliminados");

                return Ok(new
                {
                    message = $"{productos.Count} productos eliminados exitosamente",
                    productosEliminados = productos.Count,
                    success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error limpiando productos: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error al limpiar productos",
                    error = ex.Message,
                    success = false
                });
            }
        }

        // POST: api/Productos
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(ProductoDTO dto)
        {
            var producto = new Producto
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Precio = dto.Precio,
                Stock = dto.Stock
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, producto);
        }

        // PUT: api/Productos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.Id)
                return BadRequest();

            _context.Entry(producto).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound();

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}