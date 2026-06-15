using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdoption.API.Contracts.AdoptionRequests;
using PetAdoption.API.Contracts.Common;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Enums;

namespace PetAdoption.API.Controllers
{
    [ApiController]
    [Route("api/adoption-requests")]
    [Authorize]
    public class AdoptionRequestsController : ControllerBase
    {
        private readonly IAdoptionRequestService _adoptionRequestService;

        public AdoptionRequestsController(IAdoptionRequestService adoptionRequestService)
        {
            _adoptionRequestService = adoptionRequestService;
        }

        // POST api/adoption-requests/{petId}
        [HttpPost("{petId:guid}")]
        public async Task<IActionResult> SendRequest(Guid petId, [FromBody] SendAdoptionRequestRequest request)
        {
            var adopterId = GetUserId();
            var adopterEmail = GetUserEmail();
            var adopterName = GetUserName();

            var requestId = await _adoptionRequestService.SendRequestAsync(
                petId, adopterId, adopterEmail, adopterName, request.Message);

            return Ok(new { requestId });
        }

        // GET api/adoption-requests/incoming
        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncomingRequests(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null)
        {
            var ownerId = GetUserId();
            AdoptionRequestStatus? statusFilter = null;
            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AdoptionRequestStatus>(status, true, out var s))
                statusFilter = s;

            var (requests, totalCount) = await _adoptionRequestService.GetIncomingRequestsAsync(
                ownerId, pageNumber, pageSize, statusFilter);

            return Ok(new PagedResponse<object>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = requests.Select(r => (object)r).ToList()
            });
        }

        // GET api/adoption-requests/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyRequests(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null)
        {
            var adopterId = GetUserId();
            AdoptionRequestStatus? statusFilter = null;
            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AdoptionRequestStatus>(status, true, out var s))
                statusFilter = s;

            var (requests, totalCount) = await _adoptionRequestService.GetMyRequestsAsync(
                adopterId, pageNumber, pageSize, statusFilter);

            return Ok(new PagedResponse<object>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = requests.Select(r => (object)r).ToList()
            });
        }

        // PUT api/adoption-requests/{id}/approve
        [HttpPut("{id:guid}/approve")]
        public async Task<IActionResult> ApproveRequest(Guid id)
        {
            var ownerId = GetUserId();
            var respondedBy = GetUserEmail();
            await _adoptionRequestService.ApproveRequestAsync(id, ownerId, respondedBy);
            return NoContent();
        }

        // PUT api/adoption-requests/{id}/reject
        [HttpPut("{id:guid}/reject")]
        public async Task<IActionResult> RejectRequest(Guid id)
        {
            var ownerId = GetUserId();
            var respondedBy = GetUserEmail();
            await _adoptionRequestService.RejectRequestAsync(id, ownerId, respondedBy);
            return NoContent();
        }

        // DELETE api/adoption-requests/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> CancelRequest(Guid id)
        {
            var adopterId = GetUserId();
            await _adoptionRequestService.CancelRequestAsync(id, adopterId);
            return NoContent();
        }

        // ═══════════════════════════════
        private Guid GetUserId()
        {
            var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim is null || !Guid.TryParse(claim.Value, out var id))
                throw new UnauthorizedAccessException("User ID not found in token.");
            return id;
        }

        private string GetUserEmail()
        {
            var claim = User.FindFirst(JwtRegisteredClaimNames.Email)
                ?? User.FindFirst(ClaimTypes.Email);
            return claim?.Value ?? "unknown";
        }

        private string GetUserName()
        {
            var claim = User.FindFirst(JwtRegisteredClaimNames.Name)
                ?? User.FindFirst(ClaimTypes.Name);
            return claim?.Value ?? "unknown";
        }
    }
}