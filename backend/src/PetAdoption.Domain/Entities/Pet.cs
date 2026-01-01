using PetAdoption.Domain.Enums;

namespace PetAdoption.Domain.Entities
{
    public class Pet
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public bool IsActive { get; private set; }

        public Species Species { get; private set; }
        public int AgeInMonths { get; private set; }
        public Gender Gender { get; private set; }
        public bool IsVaccinated { get; private set; }
        public string Description { get; private set; } = string.Empty;

        // Location (Geospatial)
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }

        // Location (Readable)
        public string City { get; private set; } = string.Empty;
        public string State { get; private set; } = string.Empty;

        public Guid OwnerId { get; private set; }
        public PetStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public string CreatedBy { get; private set; } = string.Empty;
        public DateTime? UpdatedAt { get; private set; }
        public string? UpdatedBy { get; private set; } = string.Empty;

        // Needed for EF core when It will make empty instance of Pet
        private Pet() { }

        // Constructor
        public Pet(string name, 
            Species species, 
            int ageInMonths, 
            Gender gender, 
            bool isVaccinated, 
            string description, 
            double latitude, 
            double longitude, 
            string city, 
            string state, 
            Guid ownerId, 
            string createdBy)
        {
            //Lightweight Checks
            if (ageInMonths < 0) throw new ArgumentOutOfRangeException(nameof(ageInMonths));

            if (latitude < -90 || latitude > 90) throw new ArgumentOutOfRangeException(nameof(latitude));

            if (longitude < -180 || longitude > 180) throw new ArgumentOutOfRangeException(nameof(longitude));

            if (ownerId == Guid.Empty) throw new ArgumentException("OwnerId is required");

            Id = Guid.NewGuid();
            Name = name;
            IsActive = true;
            Species = species;
            AgeInMonths = ageInMonths;
            Gender = gender;
            IsVaccinated = isVaccinated;
            Description = description;
            Latitude = latitude;
            Longitude = longitude;
            City = city;
            State = state;
            OwnerId = ownerId;
            Status = PetStatus.Available;
            CreatedAt = DateTime.UtcNow;
            CreatedBy = createdBy;
        }

        public void MarkAsAdopted(string updatedBy)
        {
            if(Status == PetStatus.Adopted)
            {
                throw new InvalidOperationException("Pet is already adopted");
            }
            Status = PetStatus.Adopted;
            UpdatedAt = DateTime.UtcNow;
            UpdatedBy = updatedBy;
        }

        public void Disable(string updatedBy)
        {
            if(Status == PetStatus.Disabled)
            {
                throw new InvalidOperationException("Pet is already disabled");
            }
            Status = PetStatus.Disabled;
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
            UpdatedBy = updatedBy;
        }
    }
}
