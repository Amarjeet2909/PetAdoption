using Microsoft.EntityFrameworkCore;
using PetAdoption.Domain.Entities;

namespace PetAdoption.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Pet> Pets => Set<Pet>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Future entity configurations go here
        }
    }
}
