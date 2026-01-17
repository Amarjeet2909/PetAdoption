using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Security
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}