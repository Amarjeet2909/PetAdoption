using PetAdoption.Domain.Enums;

namespace PetAdoption.Domain.Entities
{
    public class AdoptionRequest
    {
        public Guid Id { get; private set; }
        public Guid PetId { get; private set; }
        public Guid AdopterId { get; private set; }
        public string AdopterEmail { get; private set; } = string.Empty;
        public string AdopterName { get; private set; } = string.Empty;
        public string Message { get; private set; } = string.Empty;
        public AdoptionRequestStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? RespondedAt { get; private set; }
        public string? RespondedBy { get; private set; }

        // Navigation for EF Core Include
        public Pet? Pet { get; private set; }

        private AdoptionRequest() { }

        public AdoptionRequest(Guid petId, Guid adopterId, string adopterEmail, string adopterName, string message)
        {
            if (petId == Guid.Empty) throw new ArgumentException("PetId is required.");
            if (adopterId == Guid.Empty) throw new ArgumentException("AdopterId is required.");
            if (string.IsNullOrWhiteSpace(adopterEmail)) throw new ArgumentException("AdopterEmail is required.");

            Id = Guid.NewGuid();
            PetId = petId;
            AdopterId = adopterId;
            AdopterEmail = adopterEmail;
            AdopterName = adopterName;
            Message = message;
            Status = AdoptionRequestStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        public void Approve(string respondedBy)
        {
            if (Status != AdoptionRequestStatus.Pending)
                throw new InvalidOperationException("Only pending requests can be approved.");

            Status = AdoptionRequestStatus.Approved;
            RespondedAt = DateTime.UtcNow;
            RespondedBy = respondedBy;
        }

        public void Reject(string respondedBy)
        {
            if (Status != AdoptionRequestStatus.Pending)
                throw new InvalidOperationException("Only pending requests can be rejected.");

            Status = AdoptionRequestStatus.Rejected;
            RespondedAt = DateTime.UtcNow;
            RespondedBy = respondedBy;
        }

        public void Cancel(Guid adopterId)
        {
            if (AdopterId != adopterId)
                throw new UnauthorizedAccessException("You can only cancel your own request.");

            if (Status != AdoptionRequestStatus.Pending)
                throw new InvalidOperationException("Only pending requests can be cancelled.");

            Status = AdoptionRequestStatus.Cancelled;
            RespondedAt = DateTime.UtcNow;
        }
    }
}