using Microsoft.EntityFrameworkCore;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Domain.Entities;
using PetAdoption.Infrastructure.Data;

namespace PetAdoption.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task<(IReadOnlyList<User> Users, int TotalCount)> GetAllAsync(int skip, int take, string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(u => u.Email.ToLower().Contains(term) || u.Name.ToLower().Contains(term));
            }

            query = query.OrderByDescending(u => u.CreatedAt);
            int totalCount = await query.CountAsync();
            var users = await query.Skip(skip).Take(take).ToListAsync();
            return (users, totalCount);
        }

        public async Task<List<User>> GetUsersCreatedInRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Users.Where(u => u.CreatedAt >= from && u.CreatedAt <= to).ToListAsync();
        }
    }
}
