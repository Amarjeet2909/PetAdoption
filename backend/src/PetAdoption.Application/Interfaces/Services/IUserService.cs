namespace PetAdoption.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<(string Name, string Email)> GetProfileAsync(Guid userId);
        Task UpdateNameAsync(Guid userId, string newName);
        Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task DeleteAccountAsync(Guid userId);
    }
}