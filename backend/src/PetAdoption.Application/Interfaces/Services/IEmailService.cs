namespace PetAdoption.Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string toEmail, string code);
    }
}