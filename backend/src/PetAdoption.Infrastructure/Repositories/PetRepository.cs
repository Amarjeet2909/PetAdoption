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
            double radiusInKm,
            int skip,
            int take,
            string sortBy,
            string sortOrder)
        {
            const double EarthRadiusKm = 6371;

            double latRad = latitude * Math.PI / 180;
            double lonRad = longitude * Math.PI / 180;

            // 1️⃣ Base query (DB-side filtering only)
            var baseQuery = await _context.Pets
                .Where(p => p.IsActive && p.Status == PetStatus.Available)
                .ToListAsync();   // move to memory safely

            // 2️⃣ Distance calculation (in-memory)
            var nearbyPets = baseQuery
                .Where(p =>
                    EarthRadiusKm * Math.Acos(
                        Math.Cos(latRad) *
                        Math.Cos(p.Latitude * Math.PI / 180) *
                        Math.Cos((p.Longitude * Math.PI / 180) - lonRad) +
                        Math.Sin(latRad) *
                        Math.Sin(p.Latitude * Math.PI / 180)
                    ) <= radiusInKm
                );

            // 3️⃣ Sorting
            nearbyPets = ApplySorting(nearbyPets, sortBy, sortOrder);

            // 4️⃣ Pagination
            return nearbyPets
                .Skip(skip)
                .Take(take)
                .ToList();
        }

        private static IEnumerable<Pet> ApplySorting(
        IEnumerable<Pet> query,
        string sortBy,
        string sortOrder)
        {
            bool isDesc = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);

            return sortBy.ToLower() switch
            {
                "age" => isDesc
                    ? query.OrderByDescending(p => p.AgeInMonths)
                    : query.OrderBy(p => p.AgeInMonths),

                "name" => isDesc
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name),

                _ => query.OrderBy(p => p.Name)
            };
        }

        private static double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }
}
