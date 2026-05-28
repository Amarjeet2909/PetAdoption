using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string name, string email, string password);
        Task<string> LoginAsync(string email, string password);
        Task<string> VerifyEmailAsync(string email, string code);
        Task ResendVerificationAsync(string email);
        Task<string> GoogleLoginAsync(string googleToken);
    }
}
