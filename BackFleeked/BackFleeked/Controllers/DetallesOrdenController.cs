using BackFleeked.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackFleeked.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DetallesOrdenController : ControllerBase
    {
        private readonly ContextDB _context;

        public DetallesOrdenController(ContextDB context)
        {
            _context = context;
        }

        // GET: api/DetallesOrden
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleOrden>>> GetDetallesOrden()
        {
            return await _context.DetallesOrden
                .Include(d => d.Producto)
                .Include(d => d.Orden)
                .ToListAsync();
        }

        // GET: api/DetallesOrden/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleOrden>> GetDetalleOrden(int id)
        {
            var detalle = await _context.DetallesOrden
                .Include(d => d.Producto)
                .Include(d => d.Orden)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detalle == null)
                return NotFound();

            return detalle;
        }

        // POST: api/DetallesOrden
        [HttpPost]
        public async Task<ActionResult<DetalleOrden>> PostDetalleOrden(DetalleOrdenDTO dto)
        {
            var detalle = new DetalleOrden
            {
                OrdenId = dto.OrdenId,
                ProductoId = dto.ProductoId,
                Cantidad = dto.Cantidad,
                Precio = dto.Precio
            };

            _context.DetallesOrden.Add(detalle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetalleOrden), new { id = detalle.Id }, detalle);
        }

        // PUT: api/DetallesOrden/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleOrden(int id, DetalleOrden detalle)
        {
            if (id != detalle.Id)
                return BadRequest();

            _context.Entry(detalle).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/DetallesOrden/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleOrden(int id)
        {
            var detalle = await _context.DetallesOrden.FindAsync(id);
            if (detalle == null)
                return NotFound();

            _context.DetallesOrden.Remove(detalle);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
