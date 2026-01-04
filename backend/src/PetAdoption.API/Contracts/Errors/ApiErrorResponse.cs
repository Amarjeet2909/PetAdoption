namespace PetAdoption.API.Contracts.Errors
{
    public class ApiErrorResponse
    {
        public int StatusCode { get; init; }
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }
    }
}
