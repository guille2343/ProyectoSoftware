using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{

    public class Orden
    {
        [Key] public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }  

        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public int MetodoPagoId { get; set; }
        public MetodoPago MetodoPago { get; set; }

        public ICollection<DetalleOrden> DetallesOrden { get; set; }
    }

    public class OrdenDTO
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public int UsuarioId { get; set; }
        public int MetodoPagoId { get; set; }
    }

}
