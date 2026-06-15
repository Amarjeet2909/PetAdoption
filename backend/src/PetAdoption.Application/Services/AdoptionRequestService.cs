using Microsoft.Extensions.Logging;
using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Services
{
    public class AdoptionRequestService : IAdoptionRequestService
    {
        private readonly IAdoptionRequestRepository _requestRepository;
        private readonly IPetRepository _petRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<AdoptionRequestService> _logger;

        public AdoptionRequestService(
            IAdoptionRequestRepository requestRepository,
            IPetRepository petRepository,
            IUnitOfWork unitOfWork,
            ILogger<AdoptionRequestService> logger)
        {
            _requestRepository = requestRepository;
            _petRepository = petRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Guid> SendRequestAsync(
            Guid petId, Guid adopterId, string adopterEmail, string adopterName, string message)
        {
            var pet = await _petRepository.GetByIdAsync(petId)
                ?? throw new InvalidOperationException("Pet not found.");

            if (pet.OwnerId == adopterId)
                throw new InvalidOperationException("You cannot send an adoption request for your own pet.");

            if (pet.Status != PetStatus.Available)
                throw new InvalidOperationException("This pet is not available for adoption.");

            var existing = await _requestRepository.GetPendingByPetAndAdopterAsync(petId, adopterId);
            if (existing != null)
                throw new InvalidOperationException("You already have a pending request for this pet.");

            var request = new AdoptionRequest(petId, adopterId, adopterEmail, adopterName, message);
            await _requestRepository.AddAsync(request);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Adoption request sent | RequestId={RequestId} PetId={PetId} AdopterId={AdopterId}",
                request.Id, petId, adopterId);

            return request.Id;
        }

        public async Task ApproveRequestAsync(Guid requestId, Guid ownerId, string respondedBy)
        {
            var request = await _requestRepository.GetByIdAsync(requestId)
                ?? throw new InvalidOperationException("Adoption request not found.");

            var pet = await _petRepository.GetByIdAsync(request.PetId)
                ?? throw new InvalidOperationException("Pet not found.");

            if (pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("Only the pet owner can approve this request.");

            if (pet.Status != PetStatus.Available)
                throw new InvalidOperationException("This pet is no longer available for adoption.");

            request.Approve(respondedBy);
            pet.MarkAsAdopted(respondedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Adoption request approved | RequestId={RequestId} PetId={PetId}", requestId, pet.Id);
        }

        public async Task RejectRequestAsync(Guid requestId, Guid ownerId, string respondedBy)
        {
            var request = await _requestRepository.GetByIdAsync(requestId)
                ?? throw new InvalidOperationException("Adoption request not found.");

            var pet = await _petRepository.GetByIdAsync(request.PetId)
                ?? throw new InvalidOperationException("Pet not found.");

            if (pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("Only the pet owner can reject this request.");

            request.Reject(respondedBy);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Adoption request rejected | RequestId={RequestId}", requestId);
        }

        public async Task CancelRequestAsync(Guid requestId, Guid adopterId)
        {
            var request = await _requestRepository.GetByIdAsync(requestId)
                ?? throw new InvalidOperationException("Adoption request not found.");

            request.Cancel(adopterId);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Adoption request cancelled | RequestId={RequestId} AdopterId={AdopterId}",
                requestId, adopterId);
        }

        public async Task<(IReadOnlyList<AdoptionRequestDto> Requests, int TotalCount)> GetIncomingRequestsAsync(
            Guid ownerId, int pageNumber, int pageSize, AdoptionRequestStatus? status)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            var (requests, totalCount) = await _requestRepository.GetByPetOwnerAsync(ownerId, skip, pageSize, status);
            return (requests.Select(ToDto).ToList(), totalCount);
        }

        public async Task<(IReadOnlyList<AdoptionRequestDto> Requests, int TotalCount)> GetMyRequestsAsync(
            Guid adopterId, int pageNumber, int pageSize, AdoptionRequestStatus? status)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            var (requests, totalCount) = await _requestRepository.GetByAdopterAsync(adopterId, skip, pageSize, status);
            return (requests.Select(ToDto).ToList(), totalCount);
        }

        private static AdoptionRequestDto ToDto(AdoptionRequest r) => new()
        {
            Id = r.Id,
            PetId = r.PetId,
            PetName = r.Pet?.Name ?? string.Empty,
            PetPhotoUrls = r.Pet?.PhotoUrls ?? new List<string>(),
            AdopterId = r.AdopterId,
            AdopterEmail = r.AdopterEmail,
            AdopterName = r.AdopterName,
            Message = r.Message,
            Status = r.Status.ToString(),
            CreatedAt = r.CreatedAt,
            RespondedAt = r.RespondedAt
        };
    }
}