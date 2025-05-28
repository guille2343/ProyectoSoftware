using System.ComponentModel.DataAnnotations;

namespace BackFleeked.Models
{

    public class MetodoPago
    {
        [Key] public int Id { get; set; }
        public string Tipo { get; set; }
        public string Detalles { get; set; }

        public ICollection<Orden> Ordenes { get; set; }
    }

    public class MetodoPagoDTO
    {
        public int Id { get; set; }
        public string Tipo { get; set; }
        public string Detalles { get; set; }
    }

}
