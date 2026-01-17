using Microsoft.EntityFrameworkCore;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Domain.Entities;
using PetAdoption.Infrastructure.Data;
using PetAdoption.Infrastructure.Persistence;

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

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }
    }
}
