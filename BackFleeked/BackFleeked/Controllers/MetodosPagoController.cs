using BackFleeked.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackFleeked.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MetodosPagoController : ControllerBase
    {
        private readonly ContextDB _context;

        public MetodosPagoController(ContextDB context)
        {
            _context = context;
        }

        // GET: api/MetodosPago
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetodoPago>>> GetMetodosPago()
        {
            return await _context.MetodosPago.ToListAsync();
        }

        // GET: api/MetodosPago/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MetodoPago>> GetMetodoPago(int id)
        {
            var metodo = await _context.MetodosPago.FindAsync(id);
            if (metodo == null)
                return NotFound();

            return metodo;
        }

        // POST: api/MetodosPago
        [HttpPost]
        public async Task<ActionResult<MetodoPago>> PostMetodoPago(MetodoPagoDTO dto)
        {
            var metodo = new MetodoPago
            {
                Tipo = dto.Tipo,
                Detalles = dto.Detalles
            };

            _context.MetodosPago.Add(metodo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMetodoPago), new { id = metodo.Id }, metodo);
        }

        // PUT: api/MetodosPago/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMetodoPago(int id, MetodoPago metodo)
        {
            if (id != metodo.Id)
                return BadRequest();

            _context.Entry(metodo).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/MetodosPago/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMetodoPago(int id)
        {
            var metodo = await _context.MetodosPago.FindAsync(id);
            if (metodo == null)
                return NotFound();

            _context.MetodosPago.Remove(metodo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
