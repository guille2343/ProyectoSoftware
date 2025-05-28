using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{
    public class Producto
    {
        [Key] public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }

        public ICollection<DetalleOrden> DetallesOrden { get; set; }
    }

    public class ProductoDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }

    }
}
