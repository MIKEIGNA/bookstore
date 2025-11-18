namespace BookStoreApi.Models;
public class Order { public int Id { get; set; } public int BookId { get; set; } public int Quantity { get; set; } public decimal? TotalPrice { get; set; } public string? CustomerName { get; set; } }
