using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        private readonly IImageUploadService _imageUploadService;

        public PetsController(IPetService petService, IImageUploadService imageUploadService)
        {
            _petService = petService;
            _imageUploadService = imageUploadService;
        }

        // POST: api/pets
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePet([FromBody] CreatePetRequest request)
        {
            var ownerId = GetUserId();
            var createdBy = GetUserEmail();

            var petId = await _petService.CreatePetAsync(
                request.Name, request.Species, request.AgeInMonths, request.Gender,
                request.IsVaccinated, request.Description, request.Latitude, request.Longitude,
                request.City, request.State, ownerId, createdBy);

            return CreatedAtAction(nameof(GetPetById), new { id = petId }, new { PetId = petId });
        }

        // POST: api/pets/{id}/photos
        [Authorize]
        [HttpPost("{id:guid}/photos")]
        public async Task<IActionResult> UploadPhotos(Guid id, List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "At least one image is required." });

            if (files.Count > 5)
                return BadRequest(new { message = "Maximum 5 images allowed." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(ext))
                    return BadRequest(new { message = $"File '{file.FileName}' has invalid extension. Only .jpg, .jpeg, .png, .webp are allowed." });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { message = $"File '{file.FileName}' exceeds 5MB limit." });
            }

            var pet = await _petService.GetPetByIdAsync(id);
            if (pet == null) return NotFound();

            var ownerId = GetUserId();
            if (pet.OwnerId != ownerId)
                return Forbid();

            // Upload all to Cloudinary
            var uploadedUrls = new List<string>();

            foreach (var file in files)
            {
                using var stream = file.OpenReadStream();
                var ext = Path.GetExtension(file.FileName).ToLower();
                var url = await _imageUploadService.UploadImageAsync(stream, $"pet-{id}-{Guid.NewGuid()}{ext}");
                uploadedUrls.Add(url);
            }

            // Save URLs in DB
            await _petService.UpdatePetPhotosAsync(id, uploadedUrls, GetUserEmail());

            return Ok(new { photoUrls = uploadedUrls });
        }

        // GET: api/pets/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPetById(Guid id)
        {
            var pet = await _petService.GetPetByIdAsync(id);
            if (pet is null) return NotFound();
            return Ok(pet.ToPetResponse());
        }

        // GET: api/pets
        [HttpGet]
        public async Task<IActionResult> GetPets(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var (pets, totalCount) = await _petService.GetPetsAsync(pageNumber, pageSize, search);

            var response = new PagedResponse<PetSummaryResponse>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = pets.Select(p => p.ToPetSummaryResponse()).ToList()
            };

            return Ok(response);
        }

        // GET: api/pets/mine
        [Authorize]
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyPets(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var ownerId = GetUserId();
            var (pets, totalCount) = await _petService.GetMyPetsAsync(ownerId, pageNumber, pageSize);

            var response = new PagedResponse<PetSummaryResponse>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = pets.Select(p => p.ToPetSummaryResponse()).ToList()
            };

            return Ok(response);
        }

        // GET: api/pets/adopted
        [Authorize]
        [HttpGet("adopted")]
        public async Task<IActionResult> GetAdoptedPets(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var email = GetUserEmail();
            var (pets, totalCount) = await _petService.GetAdoptedPetsAsync(email, pageNumber, pageSize);

            var response = new PagedResponse<PetSummaryResponse>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = pets.Select(p => p.ToPetSummaryResponse()).ToList()
            };

            return Ok(response);
        }

        // PUT: api/pets/{id}
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdatePet(Guid id, [FromBody] UpdatePetRequest request)
        {
            var ownerId = GetUserId();
            var updatedBy = GetUserEmail();

            await _petService.UpdatePetAsync(id, ownerId, updatedBy,
                request.Name, request.Species, request.AgeInMonths, request.Gender,
                request.IsVaccinated, request.Description, request.Latitude, request.Longitude,
                request.City, request.State);

            return NoContent();
        }

        // DELETE: api/pets/{id}
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeletePet(Guid id)
        {
            var ownerId = GetUserId();
            var deletedBy = GetUserEmail();

            await _petService.DeletePetAsync(id, ownerId, deletedBy);
            return NoContent();
        }

        // GET: api/pets/nearby
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
            var (pets, totalCount) = await _petService.FindNearbyPetsAsync(
                lat, lon, radius, pageNumber, pageSize, sortBy, sortOrder, species, gender, isVaccinated);

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
        public async Task<IActionResult> AdoptPet(Guid id)
        {
            var adopterId = GetUserId();
            var adoptedBy = GetUserEmail();

            await _petService.AdoptPetAsync(id, adopterId, adoptedBy);
            return NoContent();
        }

        // ═══════════════════════════════
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim is null || !Guid.TryParse(userIdClaim.Value, out var userId))
                throw new UnauthorizedAccessException("User ID not found in token.");

            return userId;
        }

        private string GetUserEmail()
        {
            var emailClaim = User.FindFirst(JwtRegisteredClaimNames.Email)
                ?? User.FindFirst(ClaimTypes.Email);

            return emailClaim?.Value ?? "unknown";
        }
    }
}