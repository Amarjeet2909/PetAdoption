using PetAdoption.Domain.Entities;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IAnnouncementRepository
    {
        Task AddAsync(Announcement announcement);
        Task<List<Announcement>> GetActiveAsync(int count);
        Task<Announcement?> GetByIdAsync(Guid id);
    }
}