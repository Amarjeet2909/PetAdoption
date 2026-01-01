using Microsoft.EntityFrameworkCore;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;
using PetAdoption.Infrastructure.Data;

namespace PetAdoption.Infrastructure.Repositories
{
    public class PetRepository : IPetRepository
    {
        private readonly AppDbContext _context;

        public PetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Pet pet)
        {
            await _context.Pets.AddAsync(pet);
        }

        public async Task<Pet?> GetByIdAsync(Guid id)
        {
            return await _context.Pets.FirstOrDefaultAsync(p => p.Id == id);
        }

        // Finding Pets in Nearby Selected Radius - Haversine Formula
        public async Task<IReadOnlyList<Pet>> GetNearbyAsync(
        double latitude,
        double longitude,
        double radiusInKm)
        {
            // Avoid scanning whole table for invalid radius
            if (radiusInKm <= 0) return Array.Empty<Pet>();

            const double EarthRadiusKm = 6371;

            var pets = await _context.Pets
                .Where(p => p.IsActive && p.Status == PetStatus.Available)
                .Where(p =>
                    EarthRadiusKm * Math.Acos(
                        Math.Cos(DegreesToRadians(latitude)) *
                        Math.Cos(DegreesToRadians(p.Latitude)) *
                        Math.Cos(DegreesToRadians(p.Longitude) - DegreesToRadians(longitude)) +
                        Math.Sin(DegreesToRadians(latitude)) *
                        Math.Sin(DegreesToRadians(p.Latitude))
                    ) <= radiusInKm)
                .ToListAsync();

            return pets;
        }

        private static double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }
}
