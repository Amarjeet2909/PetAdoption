using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using PetAdoption.Application.Interfaces.Services;

namespace PetAdoption.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _apiKey;
        private readonly string _senderEmail;
        private readonly string _senderName;
        private readonly HttpClient _httpClient;

        public EmailService(IConfiguration configuration)
        {
            _apiKey = configuration["Resend:ApiKey"]!;
            _senderEmail = configuration["Email:SenderEmail"] ?? "onboarding@resend.dev";
            _senderName = configuration["Email:SenderName"] ?? "PetAdopt";
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task SendVerificationEmailAsync(string toEmail, string code)
        {
            var payload = new
            {
                from = $"{_senderName} <{_senderEmail}>",
                to = new[] { toEmail },
                subject = "PetAdopt - Verify Your Email",
                html = $@"
                    <div style='font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;'>
                        <h2 style='color:#f97316;'>🐾 PetAdopt</h2>
                        <p>Hi there! Your verification code is:</p>
                        <div style='background:#f97316;color:white;font-size:32px;font-weight:bold;
                                    text-align:center;padding:20px;border-radius:12px;
                                    letter-spacing:8px;margin:20px 0;'>
                            {code}
                        </div>
                        <p style='color:#666;font-size:14px;'>
                            This code expires in 10 minutes.
                            If you didn't request this, ignore this email.
                        </p>
                    </div>"
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.resend.com/emails", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"Resend email failed: {error}");
            }
        }
    }
}