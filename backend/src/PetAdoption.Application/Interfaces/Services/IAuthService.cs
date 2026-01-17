using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string email, string password);
        Task<string> LoginAsync(string email, string password);
    }
}
