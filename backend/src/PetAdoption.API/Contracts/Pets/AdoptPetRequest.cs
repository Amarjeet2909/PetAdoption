namespace PetAdoption.API.Contracts.Pets
{
    public class AdoptPetRequest
    {
        public Guid OwnerId { get; set; }
        public string AdoptedBy { get; set; } = string.Empty;
    }

}
