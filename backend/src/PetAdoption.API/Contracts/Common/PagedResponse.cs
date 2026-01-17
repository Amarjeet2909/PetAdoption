namespace PetAdoption.API.Contracts.Common
{
    public class PagedResponse<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public IReadOnlyList<T> Items { get; set; } = [];
    }
}
