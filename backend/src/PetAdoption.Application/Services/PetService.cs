using PetAdoption.Application.Interfaces.Persistence;
using PetAdoption.Application.Interfaces.Repositories;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Entities;
using PetAdoption.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace PetAdoption.Application.Services
{
    public class PetService : IPetService
    {
        private readonly ILogger<PetService> _logger;
        private readonly IPetRepository _petRepository;
        private readonly IUnitOfWork _unitOfWork;

        // Constructor
        public PetService(IPetRepository petRepository, IUnitOfWork unitOfWork, ILogger<PetService> logger)
        {
            _petRepository = petRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // Creating New Pet
        public async Task<Guid> CreatePetAsync(string name, Species species, int ageInMonths, Gender gender, bool isVaccinated,
                                  string description, double latitude, double longitude, string city, string state,
                                  Guid ownerId, string createdBy)
        {
            // Creating the object of Domain Entity - Pet
            var pet = new Pet(name, species, ageInMonths, gender, isVaccinated, description, latitude, longitude, city, state, ownerId, createdBy);

            await _petRepository.AddAsync(pet);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet Created Successfully | PetId={PetId} OwnerId={OwnerId} Species={Species}", pet.Id, pet.OwnerId, pet.Species);

            return pet.Id;
        }

        // Get Pet using ID
        public async Task<Pet?> GetPetByIdAsync(Guid petId)
        {
            return await _petRepository.GetByIdAsync(petId);
        }

        // Finding pet Nearby user
        public async Task<(IReadOnlyList<Pet>, int)> FindNearbyPetsAsync(
            double latitude,
            double longitude,
            double radiusInKm,
            int pageNumber,
            int pageSize,
            string sortBy,
            string sortOrder,
            Species? species,
            Gender? gender,
            bool? isVaccinated)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;

            int skip = (pageNumber - 1) * pageSize;

            _logger.LogInformation(
                "Nearby search | Lat={Lat} Lon={Lon} Radius={Radius} Page={Page} Size={Size} Filters={Filters}",
                latitude, longitude, radiusInKm, pageNumber, pageSize,
                new { species, gender, isVaccinated });

            return await _petRepository.GetNearbyAsync(
                latitude,
                longitude,
                radiusInKm,
                skip,
                pageSize,
                sortBy,
                sortOrder,
                species,
                gender,
                isVaccinated);
        }


        // Adopt a Pet
        public async Task AdoptPetAsync(Guid petId, Guid requesterOwnerId, string adoptedBy)
        {
            // Getting Pet Details from DB
            var pet = await _petRepository.GetByIdAsync(petId);

            if(pet == null)
            {
                _logger.LogWarning("Adoption failed | Pet not found | PetId={PetId} RequestedBy={RequestedBy}", petId, adoptedBy);
                throw new InvalidOperationException("Pet not found");
            }

            if (pet.OwnerId != requesterOwnerId)
            {
                _logger.LogWarning("Unauthorized adoption attempt | PetId={PetId} OwnerId={OwnerId} RequestedBy={RequestedBy}", pet.Id, pet.OwnerId, requesterOwnerId);

                throw new UnauthorizedAccessException("Only the pet owner can adopt this pet");
            }

            if (pet.Status == PetStatus.Adopted)
            {
                _logger.LogWarning("Adoption attempt on already adopted pet | PetId={PetId} RequestedBy={RequestedBy}", pet.Id, adoptedBy);

                throw new InvalidOperationException("Pet is already adopted");
            }

            pet.MarkAsAdopted(adoptedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet adopted successfully | PetId={PetId} AdoptedBy={AdoptedBy}", pet.Id, adoptedBy);
        }
    }
}
