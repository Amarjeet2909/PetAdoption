namespace PetAdoption.Application.Interfaces.Services
{
    public interface IGoogleAuthService
    {
        Task<GoogleUserPayload> VerifyTokenAsync(string token);
    }

    public class GoogleUserPayload
    {
        public string GoogleId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}