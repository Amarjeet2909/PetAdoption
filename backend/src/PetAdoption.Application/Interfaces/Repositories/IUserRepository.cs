using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
    }
}
