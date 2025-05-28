using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{
    public class Usuario
    {
        [Key] public int Id { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public ICollection<Orden> Ordenes { get; set; }
    }

    public class UsuarioDTO
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
    }

}
