using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdoption.API.Contracts.Common;
using PetAdoption.Application.Interfaces.Services;
using PetAdoption.Domain.Enums;

namespace PetAdoption.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] string range = "month")
        {
            var analytics = await _adminService.GetAnalyticsAsync(range);
            return Ok(analytics);
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int count = 10)
        {
            var activity = await _adminService.GetRecentActivityAsync(count);
            return Ok(activity);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var (users, totalCount) = await _adminService.GetAllUsersAsync(pageNumber, pageSize, search);
            var response = new PagedResponse<object>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = users.Select(u => new { u.Id, u.Name, u.Email, u.IsActive, Role = u.Role.ToString(), u.CreatedAt }).ToList<object>()
            };
            return Ok(response);
        }

        [HttpPut("users/{id:guid}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(Guid id)
        {
            await _adminService.ToggleUserStatusAsync(id);
            return NoContent();
        }

        [HttpPut("users/{id:guid}/role")]
        public async Task<IActionResult> ChangeUserRole(Guid id, [FromBody] ChangeRoleRequest request)
        {
            if (!Enum.TryParse<Role>(request.Role, true, out var role)) return BadRequest("Invalid role.");
            await _adminService.ChangeUserRoleAsync(id, role);
            return NoContent();
        }

        [HttpGet("pets")]
        public async Task<IActionResult> GetAllPets(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null)
        {
            var (pets, totalCount) = await _adminService.GetAllPetsAdminAsync(pageNumber, pageSize, search, status);
            var response = new PagedResponse<object>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = pets.Select(p => new { p.Id, p.Name, Species = p.Species.ToString(), p.AgeInMonths, p.City, p.State, Status = p.Status.ToString(), p.IsActive, p.OwnerId, p.CreatedBy, p.CreatedAt }).ToList<object>()
            };
            return Ok(response);
        }

        [HttpPut("pets/{id:guid}/disable")]
        public async Task<IActionResult> DisablePet(Guid id) { await _adminService.AdminDisablePetAsync(id, GetUserEmail()); return NoContent(); }

        [HttpPut("pets/{id:guid}/enable")]
        public async Task<IActionResult> EnablePet(Guid id) { await _adminService.AdminEnablePetAsync(id, GetUserEmail()); return NoContent(); }

        [HttpDelete("pets/{id:guid}")]
        public async Task<IActionResult> DeletePet(Guid id) { await _adminService.AdminDeletePetAsync(id, GetUserEmail()); return NoContent(); }

        // Announcements
        [HttpPost("announcements")]
        public async Task<IActionResult> CreateAnnouncement([FromBody] CreateAnnouncementRequest request)
        {
            await _adminService.CreateAnnouncementAsync(request.Message, request.Type, GetUserEmail());
            return Ok();
        }

        [HttpGet("announcements")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAnnouncements()
        {
            var announcements = await _adminService.GetActiveAnnouncementsAsync();
            return Ok(announcements.Select(a => new { a.Id, a.Message, a.Type, a.CreatedAt }));
        }

        [HttpDelete("announcements/{id:guid}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            await _adminService.DeactivateAnnouncementAsync(id);
            return NoContent();
        }

        private string GetUserEmail()
        {
            var emailClaim = User.FindFirst(JwtRegisteredClaimNames.Email) ?? User.FindFirst(ClaimTypes.Email);
            return emailClaim?.Value ?? "admin";
        }
    }

    public class ChangeRoleRequest { public string Role { get; set; } = string.Empty; }
    public class CreateAnnouncementRequest { public string Message { get; set; } = string.Empty; public string Type { get; set; } = "info"; }
}