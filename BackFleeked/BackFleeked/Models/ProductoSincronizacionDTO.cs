using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{
    // ✅ DTO específico para sincronización de productos
    public class ProductoSincronizacionDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(50)]
        public string Descripcion { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Precio { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; }
    }
}