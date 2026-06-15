using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Repositories
{
    public interface IAdoptionRequestRepository
    {
        Task AddAsync(AdoptionRequest request);
        Task<AdoptionRequest?> GetByIdAsync(Guid id);
        Task<AdoptionRequest?> GetPendingByPetAndAdopterAsync(Guid petId, Guid adopterId);
        Task<(IReadOnlyList<AdoptionRequest> Requests, int TotalCount)> GetByPetOwnerAsync(
            Guid ownerId, int skip, int take, AdoptionRequestStatus? status);
        Task<(IReadOnlyList<AdoptionRequest> Requests, int TotalCount)> GetByAdopterAsync(
            Guid adopterId, int skip, int take, AdoptionRequestStatus? status);
    }
}