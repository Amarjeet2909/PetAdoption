using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(Guid id);
        Task AddAsync(User user);
        Task<(IReadOnlyList<User> Users, int TotalCount)> GetAllAsync(int skip, int take, string? search = null);
        Task<List<User>> GetUsersCreatedInRangeAsync(DateTime from, DateTime to);
    }
}