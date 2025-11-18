namespace BookStoreApi.Models;
public class Book { public int Id { get; set; } public string Title { get; set; } = string.Empty; public int AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
