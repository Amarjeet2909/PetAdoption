using System.Net.Http.Json;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using PetAdoption.Application.Interfaces.Services;

namespace PetAdoption.Infrastructure.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly string _clientId;

        public GoogleAuthService(IConfiguration configuration)
        {
            _clientId = configuration["Google:ClientId"]!;
        }

        public async Task<GoogleUserPayload> VerifyTokenAsync(string token)
        {
            // Try as ID token first
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _clientId }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return new GoogleUserPayload
                {
                    GoogleId = payload.Subject,
                    Email = payload.Email,
                    Name = payload.Name ?? payload.Email.Split('@')[0]
                };
            }
            catch
            {
                // Fall back to access_token → call userinfo endpoint
                using var http = new HttpClient();
                http.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                var response = await http.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");

                if (!response.IsSuccessStatusCode)
                    throw new UnauthorizedAccessException("Invalid Google token.");

                var info = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
                if (info == null || string.IsNullOrEmpty(info.Email))
                    throw new UnauthorizedAccessException("Could not get user info from Google.");

                return new GoogleUserPayload
                {
                    GoogleId = info.Sub,
                    Email = info.Email,
                    Name = info.Name ?? info.Email.Split('@')[0]
                };
            }
        }

        private class GoogleUserInfo
        {
            public string Sub { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
        }
    }
}