using BackFleeked.Helpers;
using BackFleeked.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackFleeked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ContextDB _context;
        private readonly JwtHelper _jwtHelper;

        public UsuariosController(ContextDB context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        // POST: api/Usuarios/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            if (_context.Usuarios.Any(u => u.NombreUsuario == dto.NombreUsuario))
                return BadRequest("El usuario ya existe.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var usuario = new Usuario
            {
                NombreUsuario = dto.NombreUsuario,
                Email = dto.Email,
                Password = hashedPassword
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado correctamente.");
        }

        // POST: api/Usuarios/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            try
            {
                Console.WriteLine($"🔍 Intento de login para: {dto.NombreUsuario}"); // Debug

                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario);

                if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.Password))
                {
                    Console.WriteLine($"❌ Credenciales inválidas para: {dto.NombreUsuario}"); // Debug
                    return Unauthorized("Credenciales inválidas.");
                }

                var token = _jwtHelper.GenerateToken(usuario.NombreUsuario, "Cliente");

                // ✅ RESPUESTA ACTUALIZADA - Incluye el ID del usuario
                var response = new
                {
                    token,
                    user = new
                    {
                        Id = usuario.Id,                    // ✅ AGREGADO: ID del usuario
                        NombreUsuario = usuario.NombreUsuario,
                        Email = usuario.Email
                    }
                };

                Console.WriteLine($"✅ Login exitoso para: {dto.NombreUsuario} (ID: {usuario.Id})"); // Debug
                Console.WriteLine($"📤 Enviando respuesta: {System.Text.Json.JsonSerializer.Serialize(response)}"); // Debug

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en login: {ex.Message}"); // Debug
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        // GET: api/Usuarios
        [Authorize(Roles = "Administrador")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            return await _context.Usuarios
                .Select(u => new UsuarioDTO
                {
                    Id = u.Id,
                    NombreUsuario = u.NombreUsuario,
                    Email = u.Email
                }).ToListAsync();
        }
    }
}