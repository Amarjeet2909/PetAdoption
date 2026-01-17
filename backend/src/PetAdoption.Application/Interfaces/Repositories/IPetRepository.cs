using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IPetRepository
    {
        Task<Pet?> GetByIdAsync(Guid id);
        Task AddAsync(Pet pet);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetNearbyAsync(
        double latitude,
        double longitude,
        double radiusInKm,
        int skip,
        int take,
        string sortBy,
        string sortOrder,
        Species? species,
        Gender? gender,
        bool? isVaccinated);
    }
}
