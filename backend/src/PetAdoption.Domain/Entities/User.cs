using PetAdoption.Domain.Enums;

namespace PetAdoption.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public string PasswordHash { get; private set; } = string.Empty;
        public DateTime CreatedAt { get; private set; }
        public bool IsActive { get; private set; }
        public Role Role { get; private set; }

        // Email verification
        public bool IsEmailVerified { get; private set; }
        public string? EmailVerificationCode { get; private set; }
        public DateTime? VerificationCodeExpiry { get; private set; }

        // Google OAuth
        public string? GoogleId { get; private set; }

        private User() { }

        public User(string name, string email, string passwordHash)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
            IsEmailVerified = false;
            Role = Role.User;
        }

        // For Google OAuth users (no password, auto-verified)
        public static User CreateGoogleUser(string name, string email, string googleId)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Name = name,
                Email = email,
                PasswordHash = string.Empty,
                GoogleId = googleId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsEmailVerified = true,
                Role = Role.User
            };
        }

        public void SetVerificationCode(string code, DateTime expiry)
        {
            EmailVerificationCode = code;
            VerificationCodeExpiry = expiry;
        }

        public void VerifyEmail()
        {
            IsEmailVerified = true;
            EmailVerificationCode = null;
            VerificationCodeExpiry = null;
        }

        public void LinkGoogle(string googleId)
        {
            GoogleId = googleId;
            if (!IsEmailVerified) IsEmailVerified = true;
        }

        public void UpdateName(string newName)
        {
            if (string.IsNullOrWhiteSpace(newName)) throw new ArgumentException("Name cannot be empty.");
            Name = newName;
        }

        public void UpdateEmail(string newEmail)
        {
            if (string.IsNullOrWhiteSpace(newEmail)) throw new ArgumentException("Email cannot be empty.");
            Email = newEmail;
        }

        public void UpdatePassword(string newPasswordHash) => PasswordHash = newPasswordHash;
        public void Deactivate() => IsActive = false;
        public void Activate() => IsActive = true;
        public void ChangeRole(Role newRole) => Role = newRole;
    }
}