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

        public PetService(IPetRepository petRepository, IUnitOfWork unitOfWork, ILogger<PetService> logger)
        {
            _petRepository = petRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Guid> CreatePetAsync(string name, Species species, int ageInMonths, Gender gender, bool isVaccinated,
            string description, double latitude, double longitude, string city, string state, Guid ownerId, string createdBy)
        {
            var pet = new Pet(name, species, ageInMonths, gender, isVaccinated, description, latitude, longitude, city, state, ownerId, createdBy);

            await _petRepository.AddAsync(pet);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet Created | PetId={PetId} OwnerId={OwnerId}", pet.Id, pet.OwnerId);

            return pet.Id;
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetPetsAsync(int pageNumber, int pageSize, string? search)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            return await _petRepository.GetAllAsync(skip, pageSize, search);
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetMyPetsAsync(Guid ownerId, int pageNumber, int pageSize)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            return await _petRepository.GetByOwnerAsync(ownerId, skip, pageSize);
        }

        public async Task<(IReadOnlyList<Pet> Pets, int TotalCount)> GetAdoptedPetsAsync(string adoptedByEmail, int pageNumber, int pageSize)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            return await _petRepository.GetAdoptedByUserAsync(adoptedByEmail, skip, pageSize);
        }

        public async Task<Pet?> GetPetByIdAsync(Guid petId)
        {
            return await _petRepository.GetByIdAsync(petId);
        }

        public async Task UpdatePetAsync(Guid petId, Guid ownerId, string updatedBy,
            string name, Species species, int ageInMonths, Gender gender,
            bool isVaccinated, string description, double latitude, double longitude,
            string city, string state)
        {
            var pet = await _petRepository.GetByIdAsync(petId);

            if (pet == null)
                throw new InvalidOperationException("Pet not found.");

            if (pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("You can only edit your own pets.");

            pet.Update(name, species, ageInMonths, gender, isVaccinated, description, latitude, longitude, city, state, updatedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet Updated | PetId={PetId} UpdatedBy={UpdatedBy}", pet.Id, updatedBy);
        }

        public async Task UpdatePetPhotosAsync(Guid petId, List<string> photoUrls, string updatedBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId)
                ?? throw new InvalidOperationException("Pet not found.");

            pet.SetPhotoUrls(photoUrls, updatedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet photos updated | PetId={PetId} Count={Count}", petId, photoUrls.Count);
        }

        public async Task DeletePetAsync(Guid petId, Guid ownerId, string deletedBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId);

            if (pet == null)
                throw new InvalidOperationException("Pet not found.");

            if (pet.OwnerId != ownerId)
                throw new UnauthorizedAccessException("You can only delete your own pets.");

            pet.Disable(deletedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet Deleted | PetId={PetId} DeletedBy={DeletedBy}", pet.Id, deletedBy);
        }

        public async Task<(IReadOnlyList<Pet>, int)> FindNearbyPetsAsync(
            double latitude, double longitude, double radiusInKm,
            int pageNumber, int pageSize, string sortBy, string sortOrder,
            Species? species, Gender? gender, bool? isVaccinated)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 ? 10 : pageSize;
            int skip = (pageNumber - 1) * pageSize;

            return await _petRepository.GetNearbyAsync(latitude, longitude, radiusInKm, skip, pageSize, sortBy, sortOrder, species, gender, isVaccinated);
        }

        public async Task AdoptPetAsync(Guid petId, Guid adopterId, string adoptedBy)
        {
            var pet = await _petRepository.GetByIdAsync(petId);

            if (pet == null)
                throw new InvalidOperationException("Pet not found");

            if (pet.OwnerId == adopterId)
                throw new InvalidOperationException("You cannot adopt your own pet.");

            if (pet.Status == PetStatus.Adopted)
                throw new InvalidOperationException("Pet is already adopted.");

            pet.MarkAsAdopted(adoptedBy);

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Pet Adopted | PetId={PetId} AdoptedBy={AdoptedBy}", pet.Id, adoptedBy);
        }
    }
}