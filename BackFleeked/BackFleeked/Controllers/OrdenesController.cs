using BackFleeked.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackFleeked.Controllers
{
    [Authorize] // 👈 Protege todo el controlador
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenesController : ControllerBase
    {
        private readonly ContextDB _context;

        public OrdenesController(ContextDB context)
        {
            _context = context;
        }

        // GET: api/Ordenes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Orden>>> GetOrdenes()
        {
            return await _context.Ordenes
                .Include(o => o.Usuario)
                .Include(o => o.MetodoPago)
                .Include(o => o.DetallesOrden)
                .ThenInclude(d => d.Producto)
                .ToListAsync();
        }

        // GET: api/Ordenes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Orden>> GetOrden(int id)
        {
            var orden = await _context.Ordenes
                .Include(o => o.Usuario)
                .Include(o => o.MetodoPago)
                .Include(o => o.DetallesOrden)
                .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orden == null)
                return NotFound();

            return orden;
        }

        // POST: api/Ordenes
        [HttpPost]
        public async Task<ActionResult<Orden>> PostOrden(OrdenDTO ordenDto)
        {
            var orden = new Orden
            {
                Fecha = ordenDto.Fecha,
                Total = ordenDto.Total,
                UsuarioId = ordenDto.UsuarioId,
                MetodoPagoId = ordenDto.MetodoPagoId
            };

            _context.Ordenes.Add(orden);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrden), new { id = orden.Id }, orden);
        }

        // PUT: api/Ordenes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrden(int id, Orden orden)
        {
            if (id != orden.Id)
                return BadRequest();

            _context.Entry(orden).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Ordenes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrden(int id)
        {
            var orden = await _context.Ordenes.FindAsync(id);
            if (orden == null)
                return NotFound();

            _context.Ordenes.Remove(orden);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
