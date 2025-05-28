namespace BackFleeked.Models
{
    public class LoginDTO
    {
        public string NombreUsuario { get; set; }
        public string Password { get; set; }
    }

    public class RegisterDTO
    {
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
