using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IPetService
    {
        Task<Guid> CreatePetAsync(
            string name, Species species, int ageInMonths, Gender gender,
            bool isVaccinated, string description, double latitude, double longitude,
            string city, string state, Guid ownerId, string createdBy);

        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetPetsAsync(int pageNumber, int pageSize, string? search);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetMyPetsAsync(Guid ownerId, int pageNumber, int pageSize);
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAdoptedPetsAsync(string adoptedByEmail, int pageNumber, int pageSize);
        Task<Pet?> GetPetByIdAsync(Guid id);

        Task UpdatePetAsync(Guid petId, Guid ownerId, string updatedBy,
            string name, Species species, int ageInMonths, Gender gender,
            bool isVaccinated, string description, double latitude, double longitude,
            string city, string state);

        Task UpdatePetPhotosAsync(Guid petId, List<string> photoUrls, string updatedBy);
        Task DeletePetAsync(Guid petId, Guid ownerId, string deletedBy);

        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> FindNearbyPetsAsync(
            double latitude, double longitude, double radiusInKm,
            int pageNumber, int pageSize, string sortBy, string sortOrder,
            Species? species, Gender? gender, bool? isVaccinated);

        Task AdoptPetAsync(Guid petId, Guid adopterId, string adoptedBy);
    }
}