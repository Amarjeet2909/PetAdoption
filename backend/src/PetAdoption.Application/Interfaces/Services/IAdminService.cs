using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IAdminService
    {
        // Dashboard
        Task<AdminDashboardStats> GetDashboardStatsAsync();
        Task<AdminAnalytics> GetAnalyticsAsync(string range);
        Task<List<RecentActivity>> GetRecentActivityAsync(int count);

        // Users
        Task<(IReadOnlyList<User> Users, int TotalCount)> GetAllUsersAsync(int pageNumber, int pageSize, string? search);
        Task ToggleUserStatusAsync(Guid userId);
        Task ChangeUserRoleAsync(Guid userId, Role newRole);

        // Pets
        Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllPetsAdminAsync(int pageNumber, int pageSize, string? search, string? status);
        Task AdminDisablePetAsync(Guid petId, string disabledBy);
        Task AdminEnablePetAsync(Guid petId, string enabledBy);
        Task AdminDeletePetAsync(Guid petId, string deletedBy);

        // Announcements
        Task CreateAnnouncementAsync(string message, string type, string createdBy);
        Task<List<Announcement>> GetActiveAnnouncementsAsync();
        Task DeactivateAnnouncementAsync(Guid id);
    }

    public class AdminDashboardStats
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalPets { get; set; }
        public int AdoptedPets { get; set; }
        public int AvailablePets { get; set; }
    }

    public class AdminAnalytics
    {
        public List<DailyCount> AdoptionTrend { get; set; } = new();
        public List<DailyCount> UserGrowth { get; set; } = new();
        public List<NamedCount> SpeciesBreakdown { get; set; } = new();
        public List<NamedCount> TopCities { get; set; } = new();
        public List<NamedCount> PeakHours { get; set; } = new();
    }

    public class DailyCount
    {
        public string Date { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class NamedCount
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RecentActivity
    {
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}