using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{

    public class DetalleOrden
    {
        [Key] public int Id { get; set; }

        public int OrdenId { get; set; }
        public Orden Orden { get; set; }

        public int ProductoId { get; set; }
        public Producto Producto { get; set; }

        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
    }

    public class DetalleOrdenDTO
    {
        public int Id { get; set; }
        public int OrdenId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
    }

}
