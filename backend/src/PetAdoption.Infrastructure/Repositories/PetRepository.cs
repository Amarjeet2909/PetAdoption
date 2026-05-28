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

        public async Task AddAsync(Pet pet) => await _context.Pets.AddAsync(pet);

        public async Task<Pet?> GetByIdAsync(Guid id) => await _context.Pets.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllAsync(int skip, int take, string? search)
        {
            var query = _context.Pets.Where(p => p.IsActive && p.Status == PetStatus.Available);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) || p.City.ToLower().Contains(term) || p.State.ToLower().Contains(term));
            }

            query = query.OrderBy(p => p.Name);
            int totalCount = await query.CountAsync();
            var pets = await query.Skip(skip).Take(take).ToListAsync();
            return (pets, totalCount);
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllUnfilteredAsync(int skip, int take, string? search, string? status)
        {
            var query = _context.Pets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) || p.City.ToLower().Contains(term) || p.CreatedBy.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<PetStatus>(status, true, out var s))
            {
                query = query.Where(p => p.Status == s);
            }

            query = query.OrderByDescending(p => p.CreatedAt);
            int totalCount = await query.CountAsync();
            var pets = await query.Skip(skip).Take(take).ToListAsync();
            return (pets, totalCount);
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetByOwnerAsync(Guid ownerId, int skip, int take)
        {
            var query = _context.Pets.Where(p => p.OwnerId == ownerId && p.IsActive).OrderByDescending(p => p.CreatedAt);
            int totalCount = await query.CountAsync();
            var pets = await query.Skip(skip).Take(take).ToListAsync();
            return (pets, totalCount);
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAdoptedByUserAsync(string adoptedByEmail, int skip, int take)
        {
            var query = _context.Pets.Where(p => p.Status == PetStatus.Adopted && p.UpdatedBy == adoptedByEmail).OrderByDescending(p => p.UpdatedAt);
            int totalCount = await query.CountAsync();
            var pets = await query.Skip(skip).Take(take).ToListAsync();
            return (pets, totalCount);
        }

        public async Task<int> CountAsync() => await _context.Pets.CountAsync();
        public async Task<int> CountAdoptedAsync() => await _context.Pets.CountAsync(p => p.Status == PetStatus.Adopted);

        public async Task<List<Pet>> GetAdoptedInRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Pets
                .Where(p => p.Status == PetStatus.Adopted && p.UpdatedAt >= from && p.UpdatedAt <= to)
                .ToListAsync();
        }

        public async Task<List<Pet>> GetAllPetsRawAsync()
        {
            return await _context.Pets.ToListAsync();
        }

        public async Task<(IReadOnlyList<Pet>, int)> GetNearbyAsync(
            double latitude, double longitude, double radiusInKm,
            int skip, int take, string sortBy, string sortOrder,
            Species? species, Gender? gender, bool? isVaccinated)
        {
            const double EarthRadiusKm = 6371;
            double latRad = latitude * Math.PI / 180;
            double lonRad = longitude * Math.PI / 180;

            var baseQuery = await _context.Pets.Where(p => p.IsActive && p.Status == PetStatus.Available).ToListAsync();

            var query = baseQuery.Where(p =>
                EarthRadiusKm * Math.Acos(
                    Math.Cos(latRad) * Math.Cos(p.Latitude * Math.PI / 180) *
                    Math.Cos((p.Longitude * Math.PI / 180) - lonRad) +
                    Math.Sin(latRad) * Math.Sin(p.Latitude * Math.PI / 180)
                ) <= radiusInKm);

            if (species.HasValue) query = query.Where(p => p.Species == species);
            if (gender.HasValue) query = query.Where(p => p.Gender == gender);
            if (isVaccinated.HasValue) query = query.Where(p => p.IsVaccinated == isVaccinated);

            int totalCount = query.Count();
            bool isDesc = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);
            query = sortBy.ToLower() switch
            {
                "age" => isDesc ? query.OrderByDescending(p => p.AgeInMonths) : query.OrderBy(p => p.AgeInMonths),
                _ => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name)
            };

            var pets = query.Skip(skip).Take(take).ToList();
            return (pets, totalCount);
        }
    }
}
