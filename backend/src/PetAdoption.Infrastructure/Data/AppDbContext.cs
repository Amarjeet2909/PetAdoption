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
        public DbSet<Announcement> Announcements => Set<Announcement>();
        public DbSet<AdoptionRequest> AdoptionRequests => Set<AdoptionRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Pet>()
                .Property(p => p.PhotoUrls)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => string.IsNullOrWhiteSpace(v)
                        ? new List<string>()
                        : System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
                )
                .Metadata.SetValueComparer(
                    new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
                        (c1, c2) => c1!.SequenceEqual(c2!),
                        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                        c => c.ToList()
                    )
                );

            // AdoptionRequest -> Pet (no cascade delete to avoid accidental data loss)
            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(r => r.Pet)
                .WithMany()
                .HasForeignKey(r => r.PetId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}