namespace PetAdoption.Domain.Entities
{
    public class Announcement
    {
        public Guid Id { get; private set; }
        public string Message { get; private set; } = string.Empty;
        public string Type { get; private set; } = "info"; // info, warning, success
        public bool IsActive { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public string CreatedBy { get; private set; } = string.Empty;

        private Announcement() { }

        public Announcement(string message, string type, string createdBy)
        {
            Id = Guid.NewGuid();
            Message = message;
            Type = type;
            IsActive = true;
            CreatedAt = DateTime.UtcNow;
            CreatedBy = createdBy;
        }

        public void Deactivate() => IsActive = false;
    }
}