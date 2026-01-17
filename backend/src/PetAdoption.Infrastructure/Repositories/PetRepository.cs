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
        public async Task<(IReadOnlyList<Pet>, int)> GetNearbyAsync(
            double latitude,
            double longitude,
            double radiusInKm,
            int skip,
            int take,
            string sortBy,
            string sortOrder,
            Species? species,
            Gender? gender,
            bool? isVaccinated)
        {
            const double EarthRadiusKm = 6371;

            double latRad = latitude * Math.PI / 180;
            double lonRad = longitude * Math.PI / 180;

            var baseQuery = await _context.Pets
                .Where(p => p.IsActive && p.Status == PetStatus.Available)
                .ToListAsync();

            // Distance filter
            var query = baseQuery.Where(p =>
                EarthRadiusKm * Math.Acos(
                    Math.Cos(latRad) *
                    Math.Cos(p.Latitude * Math.PI / 180) *
                    Math.Cos((p.Longitude * Math.PI / 180) - lonRad) +
                    Math.Sin(latRad) *
                    Math.Sin(p.Latitude * Math.PI / 180)
                ) <= radiusInKm
            );

            // Filters
            if (species.HasValue)
                query = query.Where(p => p.Species == species);

            if (gender.HasValue)
                query = query.Where(p => p.Gender == gender);

            if (isVaccinated.HasValue)
                query = query.Where(p => p.IsVaccinated == isVaccinated);

            int totalCount = query.Count();

            query = ApplySorting(query, sortBy, sortOrder);

            var pets = query
                .Skip(skip)
                .Take(take)
                .ToList();

            return (pets, totalCount);
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
