using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BackFleeked.Models    
{
    public class ContextDB : DbContext
    {
        public ContextDB(DbContextOptions<ContextDB> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Orden> Ordenes { get; set; }
        public DbSet<DetalleOrden> DetallesOrden { get; set; }
        public DbSet<MetodoPago> MetodosPago { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relaciones y configuraciones adicionales si son necesarias
            modelBuilder.Entity<DetalleOrden>()
                .HasOne(d => d.Orden)
                .WithMany(o => o.DetallesOrden)
                .HasForeignKey(d => d.OrdenId);

            modelBuilder.Entity<DetalleOrden>()
                .HasOne(d => d.Producto)
                .WithMany(p => p.DetallesOrden)
                .HasForeignKey(d => d.ProductoId);

            modelBuilder.Entity<Orden>()
                .HasOne(o => o.Usuario)
                .WithMany(u => u.Ordenes)
                .HasForeignKey(o => o.UsuarioId);

            modelBuilder.Entity<Orden>()
                .HasOne(o => o.MetodoPago)
                .WithMany(m => m.Ordenes)
                .HasForeignKey(o => o.MetodoPagoId);
        }
    }
}
