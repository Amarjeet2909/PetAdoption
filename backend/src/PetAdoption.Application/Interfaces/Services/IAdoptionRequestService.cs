using PetAdoption.Domain.Enums;

namespace PetAdoption.Application.Interfaces.Services
{
    public interface IAdoptionRequestService
    {
        Task<Guid> SendRequestAsync(Guid petId, Guid adopterId, string adopterEmail, string adopterName, string message);
        Task ApproveRequestAsync(Guid requestId, Guid ownerId, string respondedBy);
        Task RejectRequestAsync(Guid requestId, Guid ownerId, string respondedBy);
        Task CancelRequestAsync(Guid requestId, Guid adopterId);
        Task<(IReadOnlyList<AdoptionRequestDto> Requests, int TotalCount)> GetIncomingRequestsAsync(
            Guid ownerId, int pageNumber, int pageSize, AdoptionRequestStatus? status);
        Task<(IReadOnlyList<AdoptionRequestDto> Requests, int TotalCount)> GetMyRequestsAsync(
            Guid adopterId, int pageNumber, int pageSize, AdoptionRequestStatus? status);
    }

    public class AdoptionRequestDto
    {
        public Guid Id { get; set; }
        public Guid PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public List<string> PetPhotoUrls { get; set; } = new();
        public Guid AdopterId { get; set; }
        public string AdopterEmail { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}