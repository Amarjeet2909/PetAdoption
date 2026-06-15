using Microsoft.EntityFrameworkCore;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;
using PetAdoption.Infrastructure.Data;

namespace PetAdoption.Infrastructure.Repositories
{
    public class AdoptionRequestRepository : IAdoptionRequestRepository
    {
        private readonly AppDbContext _context;

        public AdoptionRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AdoptionRequest request) =>
            await _context.AdoptionRequests.AddAsync(request);

        public async Task<AdoptionRequest?> GetByIdAsync(Guid id) =>
            await _context.AdoptionRequests
                .Include(r => r.Pet)
                .FirstOrDefaultAsync(r => r.Id == id);

        public async Task<AdoptionRequest?> GetPendingByPetAndAdopterAsync(Guid petId, Guid adopterId) =>
            await _context.AdoptionRequests
                .FirstOrDefaultAsync(r =>
                    r.PetId == petId &&
                    r.AdopterId == adopterId &&
                    r.Status == AdoptionRequestStatus.Pending);

        public async Task<(IReadOnlyList<AdoptionRequest> Requests, int TotalCount)> GetByPetOwnerAsync(
            Guid ownerId, int skip, int take, AdoptionRequestStatus? status)
        {
            var query = _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.Pet!.OwnerId == ownerId);

            if (status.HasValue)
                query = query.Where(r => r.Status == status.Value);

            query = query.OrderByDescending(r => r.CreatedAt);
            int totalCount = await query.CountAsync();
            var requests = await query.Skip(skip).Take(take).ToListAsync();
            return (requests, totalCount);
        }

        public async Task<(IReadOnlyList<AdoptionRequest> Requests, int TotalCount)> GetByAdopterAsync(
            Guid adopterId, int skip, int take, AdoptionRequestStatus? status)
        {
            var query = _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.AdopterId == adopterId);

            if (status.HasValue)
                query = query.Where(r => r.Status == status.Value);

            query = query.OrderByDescending(r => r.CreatedAt);
            int totalCount = await query.CountAsync();
            var requests = await query.Skip(skip).Take(take).ToListAsync();
            return (requests, totalCount);
        }
    }
}