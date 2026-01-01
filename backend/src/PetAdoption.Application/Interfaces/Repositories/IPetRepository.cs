using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IPetRepository
    {
        Task<Pet?> GetByIdAsync(Guid id);
        Task AddAsync(Pet pet);
        Task<IReadOnlyList<Pet>> GetNearbyAsync(double lat, double lon, double radiusInKilometer);
    }
}
