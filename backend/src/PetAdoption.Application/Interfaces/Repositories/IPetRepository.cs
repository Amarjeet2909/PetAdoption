using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IPetRepository
    {
        Task<Pet?> GetByIdAsync(Guid id);
        Task AddAsync(Pet pet);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllAsync(int skip, int take, string? search);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllUnfilteredAsync(int skip, int take, string? search, string? status);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetByOwnerAsync(Guid ownerId, int skip, int take);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAdoptedByUserAsync(string adoptedByEmail, int skip, int take);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetNearbyAsync(
            double latitude, double longitude, double radiusInKm,
            int skip, int take, string sortBy, string sortOrder,
            Species? species, Gender? gender, bool? isVaccinated);
        Task<int> CountAsync();
        Task<int> CountAdoptedAsync();

        // Analytics
        Task<List<Pet>> GetAdoptedInRangeAsync(DateTime from, DateTime to);
        Task<List<Pet>> GetAllPetsRawAsync();
    }
}