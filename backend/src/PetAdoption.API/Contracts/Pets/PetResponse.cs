using PetAdoption.Domain.Enums;

namespace PetAdoption.API.Contracts.Pets
{
    public class PetResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Species Species { get; set; }
        public int AgeInMonths { get; set; }
        public Gender Gender { get; set; }
        public bool IsVaccinated { get; set; }
        public string Description { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;

        public PetStatus Status { get; set; }
    }
}
