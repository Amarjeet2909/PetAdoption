using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IPetService
    {
        Task<Guid> CreatePetAsync
        (
            string name,
            Species species,
            int ageInMonths,
            Gender gender,
            bool isVaccinated,
            string description,
            double latitude,
            double longitude,
            string city,
            string state,
            Guid ownerId,
            string createdBy
         );

        Task<Pet?> GetPetByIdAsync(Guid id);
        Task<IReadOnlyList<Pet>> FindNearbyPetsAsync(double latitude,double longitude,double radiusInKm,int pageNumber,int pageSize,string sortBy,string sortOrder);
        Task AdoptPetAsync(Guid petId, Guid requesterOwnerId, string adoptedBy);
    }
}
