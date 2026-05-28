using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAdoption.Application.Interfaces.Services;

namespace PetAdoption.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var (name, email) = await _userService.GetProfileAsync(userId);
            return Ok(new { userId, name, email });
        }

        // PUT: api/users/profile/name
        [HttpPut("profile/name")]
        public async Task<IActionResult> UpdateName([FromBody] UpdateNameRequest request)
        {
            var userId = GetUserId();
            await _userService.UpdateNameAsync(userId, request.Name);
            return NoContent();
        }

        // PUT: api/users/profile/password
        [HttpPut("profile/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = GetUserId();
            await _userService.ChangePasswordAsync(userId, request.OldPassword, request.NewPassword);
            return NoContent();
        }

        // DELETE: api/users/profile
        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = GetUserId();
            await _userService.DeleteAccountAsync(userId);
            return NoContent();
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null || !Guid.TryParse(userIdClaim.Value, out var userId))
                throw new UnauthorizedAccessException("User ID not found in token.");
            return userId;
        }
    }

    public class UpdateNameRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}