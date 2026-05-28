namespace PetAdoption.Application.Interfaces.Services
{
    public interface IImageUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName);
        Task DeleteImageAsync(string publicId);
    }
}