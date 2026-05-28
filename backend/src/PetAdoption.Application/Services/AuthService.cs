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
        private readonly IEmailService _emailService;
        private readonly IGoogleAuthService _googleAuthService;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher,
            IJwtTokenService jwtService, IUnitOfWork unitOfWork, IEmailService emailService,
            IGoogleAuthService googleAuthService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _googleAuthService = googleAuthService;
        }

        public async Task<string> RegisterAsync(string name, string email, string password)
        {
            var existing = await _userRepository.GetByEmailAsync(email);
            if (existing != null)
                throw new InvalidOperationException("User already exists.");

            var hash = _passwordHasher.Hash(password);
            var user = new User(name, email, hash);

            var code = Random.Shared.Next(100000, 999999).ToString();
            user.SetVerificationCode(code, DateTime.UtcNow.AddMinutes(10));

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Send email — don't fail registration if email fails
            try
            {
                await _emailService.SendVerificationEmailAsync(email, code);
            }
            catch
            {
                // Email failed but user is created. They can use "Resend Code" on verify page.
            }

            return "verification_required";
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email)
                ?? throw new UnauthorizedAccessException("Invalid credentials.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Account has been deactivated.");

            if (!user.IsEmailVerified)
                throw new InvalidOperationException("Email not verified. Please check your inbox.");

            if (string.IsNullOrEmpty(user.PasswordHash))
                throw new UnauthorizedAccessException("This account uses Google login. Please sign in with Google.");

            if (!_passwordHasher.Verify(password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            return _jwtService.GenerateToken(user);
        }

        public async Task<string> VerifyEmailAsync(string email, string code)
        {
            var user = await _userRepository.GetByEmailAsync(email)
                ?? throw new InvalidOperationException("User not found.");

            if (user.IsEmailVerified)
                throw new InvalidOperationException("Email already verified.");

            if (user.EmailVerificationCode != code)
                throw new InvalidOperationException("Invalid verification code.");

            if (user.VerificationCodeExpiry < DateTime.UtcNow)
                throw new InvalidOperationException("Verification code expired. Please request a new one.");

            user.VerifyEmail();
            await _unitOfWork.SaveChangesAsync();

            return _jwtService.GenerateToken(user);
        }

        public async Task ResendVerificationAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email)
                ?? throw new InvalidOperationException("User not found.");

            if (user.IsEmailVerified)
                throw new InvalidOperationException("Email already verified.");

            var code = Random.Shared.Next(100000, 999999).ToString();
            user.SetVerificationCode(code, DateTime.UtcNow.AddMinutes(10));
            await _unitOfWork.SaveChangesAsync();

            await _emailService.SendVerificationEmailAsync(email, code);
        }

        public async Task<string> GoogleLoginAsync(string googleToken)
        {
            var payload = await _googleAuthService.VerifyTokenAsync(googleToken);

            var user = await _userRepository.GetByEmailAsync(payload.Email);

            if (user == null)
            {
                // Create new user from Google
                user = User.CreateGoogleUser(payload.Name, payload.Email, payload.GoogleId);
                await _userRepository.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                // Link Google if not linked
                if (string.IsNullOrEmpty(user.GoogleId))
                {
                    user.LinkGoogle(payload.GoogleId);
                    await _unitOfWork.SaveChangesAsync();
                }
            }

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Account has been deactivated.");

            return _jwtService.GenerateToken(user);
        }
    }
}