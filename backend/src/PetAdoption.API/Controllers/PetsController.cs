using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdoption.API.Contracts.Common;
using PetAdoption.API.Contracts.Pets;
using PetAdoption.API.Mappings;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Enums;

namespace PetAdoption.API.Controllers
{
    [ApiController]
    [Route("api/pets")]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetsController(IPetService petService)
        {
            _petService = petService;
        }

        // POST: api/pets
        [HttpPost]
        public async Task<IActionResult> CreatePet([FromBody] CreatePetRequest request)
        {
            var ownerId = Guid.NewGuid();      // TEMP (later from auth)
            var createdBy = "system";          // TEMP

            var petId = await _petService.CreatePetAsync(
                request.Name,
                request.Species,
                request.AgeInMonths,
                request.Gender,
                request.IsVaccinated,
                request.Description,
                request.Latitude,
                request.Longitude,
                request.City,
                request.State,
                ownerId,
                createdBy);

            return CreatedAtAction(
                nameof(GetPetById),
                new { id = petId },
                new { PetId = petId });
        }

        // GET: api/pets/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPetById(Guid id)
        {
            var pet = await _petService.GetPetByIdAsync(id);

            if (pet is null) return NotFound();

            return Ok(pet.ToPetResponse());
        }

        // GET: api/pets/nearby?lat=..&lon=..&radius=..
        [HttpGet("nearby")]
        public async Task<IActionResult> FindNearbyPets(
            [FromQuery] double lat,
            [FromQuery] double lon,
            [FromQuery] double radius,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "name",
            [FromQuery] string sortOrder = "asc",
            [FromQuery] Species? species = null,
            [FromQuery] Gender? gender = null,
            [FromQuery] bool? isVaccinated = null)
        {
            var (pets, totalCount) =
                await _petService.FindNearbyPetsAsync(
                    lat, lon, radius,
                    pageNumber, pageSize,
                    sortBy, sortOrder,
                    species, gender, isVaccinated);

            var response = new PagedResponse<PetSummaryResponse>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = pets.Select(p => p.ToPetSummaryResponse()).ToList()
            };

            return Ok(response);
        }


        // POST: api/pets/{id}/adopt
        [Authorize]
        [HttpPost("{id:guid}/adopt")]
        public async Task<IActionResult> AdoptPet(
            Guid id,
            [FromBody] AdoptPetRequest request)
        {
            await _petService.AdoptPetAsync(id, request.OwnerId, request.AdoptedBy);
            return NoContent();
        }
    }
}
