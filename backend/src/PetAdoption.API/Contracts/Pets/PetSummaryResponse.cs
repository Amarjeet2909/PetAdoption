using PetAdoption.Domain.Enums;

namespace PetAdoption.API.Contracts.Pets
{
    public class PetSummaryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Species Species { get; set; }
        public int AgeInMonths { get; set; }
        public string City { get; set; } = string.Empty;
        public PetStatus Status { get; set; }
    }
}
