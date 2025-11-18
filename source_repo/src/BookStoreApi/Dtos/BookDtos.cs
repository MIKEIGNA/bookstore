namespace BookStoreApi.Dtos;
public class BookCreateDto { public string Title { get; set; } = string.Empty; public int AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
public class BookUpdateDto { public string? Title { get; set; } public int? AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
public class BookDto { public int Id { get; set; } public string Title { get; set; } = string.Empty; public int AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
