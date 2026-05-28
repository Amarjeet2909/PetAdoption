using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Security;
using PetAdoption.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace PetAdoption.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<(string Name, string Email)> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new InvalidOperationException("User not found.");
            return (user.Name, user.Email);
        }

        public async Task UpdateNameAsync(Guid userId, string newName)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new InvalidOperationException("User not found.");

            user.UpdateName(newName);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Name updated | UserId={UserId}", userId);
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new InvalidOperationException("User not found.");

            if (!_passwordHasher.Verify(oldPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect.");

            var newHash = _passwordHasher.Hash(newPassword);
            user.UpdatePassword(newHash);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Password changed | UserId={UserId}", userId);
        }

        public async Task DeleteAccountAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new InvalidOperationException("User not found.");

            user.Deactivate();
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Account deactivated | UserId={UserId}", userId);
        }
    }
}