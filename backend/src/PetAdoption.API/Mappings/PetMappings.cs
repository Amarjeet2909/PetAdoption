using PetAdoption.API.Contracts.Pets;
using PetAdoption.Domain.Entities;

namespace PetAdoption.API.Mappings
{
    public static class PetMappings
    {
        public static PetResponse ToPetResponse(this Pet pet)
        {
            return new PetResponse
            {
                Id = pet.Id,
                Name = pet.Name,
                Species = pet.Species,
                AgeInMonths = pet.AgeInMonths,
                Gender = pet.Gender,
                IsVaccinated = pet.IsVaccinated,
                Description = pet.Description,
                Latitude = pet.Latitude,
                Longitude = pet.Longitude,
                City = pet.City,
                State = pet.State,
                Status = pet.Status
            };
        }

        public static PetSummaryResponse ToPetSummaryResponse(this Pet pet)
        {
            return new PetSummaryResponse
            {
                Id = pet.Id,
                Name = pet.Name,
                Species = pet.Species,
                AgeInMonths = pet.AgeInMonths,
                City = pet.City,
                Status = pet.Status
            };
        }
    }
}
