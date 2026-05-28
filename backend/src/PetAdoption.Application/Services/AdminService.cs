using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace PetAdoption.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPetRepository _petRepository;
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<AdminService> _logger;

        public AdminService(IUserRepository userRepository, IPetRepository petRepository,
            IAnnouncementRepository announcementRepository, IUnitOfWork unitOfWork, ILogger<AdminService> logger)
        {
            _userRepository = userRepository;
            _petRepository = petRepository;
            _announcementRepository = announcementRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<AdminDashboardStats> GetDashboardStatsAsync()
        {
            var (users, totalUsers) = await _userRepository.GetAllAsync(0, int.MaxValue);
            int activeUsers = users.Count(u => u.IsActive);
            int totalPets = await _petRepository.CountAsync();
            int adoptedPets = await _petRepository.CountAdoptedAsync();

            return new AdminDashboardStats
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                TotalPets = totalPets,
                AdoptedPets = adoptedPets,
                AvailablePets = totalPets - adoptedPets
            };
        }

        public async Task<AdminAnalytics> GetAnalyticsAsync(string range)
        {
            var now = DateTime.UtcNow;
            var from = range switch
            {
                "today" => now.Date,
                "week" => now.AddDays(-7),
                "month" => now.AddDays(-30),
                _ => now.AddDays(-30)
            };

            var adoptedPets = await _petRepository.GetAdoptedInRangeAsync(from, now);
            var allPets = await _petRepository.GetAllPetsRawAsync();
            var newUsers = await _userRepository.GetUsersCreatedInRangeAsync(from, now);

            var adoptionTrend = adoptedPets
                .Where(p => p.UpdatedAt.HasValue)
                .GroupBy(p => p.UpdatedAt!.Value.Date.ToString("MMM dd"))
                .Select(g => new DailyCount { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToList();

            var userGrowth = newUsers
                .GroupBy(u => u.CreatedAt.Date.ToString("MMM dd"))
                .Select(g => new DailyCount { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToList();

            var speciesBreakdown = allPets
                .GroupBy(p => p.Species.ToString())
                .Select(g => new NamedCount { Name = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToList();

            var topCities = allPets
                .GroupBy(p => p.City)
                .Select(g => new NamedCount { Name = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(8)
                .ToList();

            var peakHours = adoptedPets
                .Where(p => p.UpdatedAt.HasValue)
                .GroupBy(p => p.UpdatedAt!.Value.Hour)
                .Select(g => new NamedCount { Name = $"{g.Key}:00", Count = g.Count() })
                .OrderBy(x => x.Name)
                .ToList();

            return new AdminAnalytics
            {
                AdoptionTrend = adoptionTrend,
                UserGrowth = userGrowth,
                SpeciesBreakdown = speciesBreakdown,
                TopCities = topCities,
                PeakHours = peakHours
            };
        }

        public async Task<List<RecentActivity>> GetRecentActivityAsync(int count)
        {
            var allPets = await _petRepository.GetAllPetsRawAsync();

            var adopted = allPets
                .Where(p => p.Status == PetStatus.Adopted && p.UpdatedAt.HasValue)
                .OrderByDescending(p => p.UpdatedAt)
                .Take(count)
                .Select(p => new RecentActivity
                {
                    Action = "adoption",
                    Description = $"{p.UpdatedBy} adopted {p.Name}",
                    Timestamp = p.UpdatedAt!.Value
                });

            var listed = allPets
                .OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .Select(p => new RecentActivity
                {
                    Action = "listed",
                    Description = $"{p.CreatedBy} listed {p.Name}",
                    Timestamp = p.CreatedAt
                });

            return adopted.Concat(listed)
                .OrderByDescending(a => a.Timestamp)
                .Take(count)
                .ToList();
        }

        public async Task<(IReadOnlyList<User> Users, int TotalCount)> GetAllUsersAsync(int pageNumber, int pageSize, string? search)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;
            return await _userRepository.GetAllAsync(skip, pageSize, search);
        }

        public async Task ToggleUserStatusAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new InvalidOperationException("User not found.");
            if (user.IsActive) user.Deactivate(); else user.Activate();
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task ChangeUserRoleAsync(Guid userId, Role newRole)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new InvalidOperationException("User not found.");
            user.ChangeRole(newRole);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAllPetsAdminAsync(int pageNumber, int pageSize, string? search, string? status)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;
            return await _petRepository.GetAllUnfilteredAsync(skip, pageSize, search, status);
        }

        public async Task AdminDisablePetAsync(Guid petId, string disabledBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId) ?? throw new InvalidOperationException("Pet not found.");
            pet.Disable(disabledBy);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task AdminEnablePetAsync(Guid petId, string enabledBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId) ?? throw new InvalidOperationException("Pet not found.");
            pet.Enable(enabledBy);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task AdminDeletePetAsync(Guid petId, string deletedBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId) ?? throw new InvalidOperationException("Pet not found.");
            pet.Disable(deletedBy);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task CreateAnnouncementAsync(string message, string type, string createdBy)
        {
            var announcement = new Announcement(message, type, createdBy);
            await _announcementRepository.AddAsync(announcement);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<Announcement>> GetActiveAnnouncementsAsync()
        {
            return await _announcementRepository.GetActiveAsync(5);
        }

        public async Task DeactivateAnnouncementAsync(Guid id)
        {
            var announcement = await _announcementRepository.GetByIdAsync(id);
            if (announcement != null)
            {
                announcement.Deactivate();
                await _unitOfWork.SaveChangesAsync();
            }
        }
    }
}