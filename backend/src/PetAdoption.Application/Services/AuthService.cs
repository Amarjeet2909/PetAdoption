using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Security;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenService _jwtService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenService jwtService, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
            _unitOfWork = unitOfWork;
        }

        public async Task<string> RegisterAsync(string email, string password)
        {
            var existing = await _userRepository.GetByEmailAsync(email);
            if (existing != null)
            {
                throw new InvalidOperationException("User ALready Exists");
            }

            var hash = _passwordHasher.Hash(password);
            var user = new User(email, hash);

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return _jwtService.GenerateToken(user);
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email) ?? throw new UnauthorizedAccessException("Invalid Credentials");

            if (!_passwordHasher.Verify(password, user.PasswordHash)) throw new UnauthorizedAccessException("Invalid credentials");

            return _jwtService.GenerateToken(user);
        }
    }
}