using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using PetAdoption.Application.Interfaces.Services;

namespace PetAdoption.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendVerificationEmailAsync(string toEmail, string code)
        {
            var smtpHost = _configuration["Email:SmtpHost"]!;
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"]!);
            var senderEmail = _configuration["Email:SenderEmail"]!;
            var senderPassword = _configuration["Email:SenderPassword"]!;
            var senderName = _configuration["Email:SenderName"] ?? "PetAdopt";

            var message = new MailMessage();
            message.From = new MailAddress(senderEmail.Trim(), senderName.Trim());
            message.To.Add(new MailAddress(toEmail.Trim()));
            message.Subject = "PetAdopt - Verify Your Email";
            message.IsBodyHtml = true;
            message.Body = $@"
                <div style='font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;'>
                    <h2 style='color:#f97316;'>PetAdopt</h2>
                    <p>Hi there! Your verification code is:</p>
                    <div style='background:#f97316;color:white;font-size:32px;font-weight:bold;text-align:center;padding:20px;border-radius:12px;letter-spacing:8px;margin:20px 0;'>
                        {code}
                    </div>
                    <p style='color:#666;font-size:14px;'>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
                </div>";

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail.Trim(), senderPassword.Trim()),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}