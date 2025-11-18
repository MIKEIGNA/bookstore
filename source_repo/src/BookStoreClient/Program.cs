using System.Net.Http.Json;

var apiBase = Environment.GetEnvironmentVariable("API_BASE") ?? "http://localhost:5000/api";
using var client = new HttpClient();
client.BaseAddress = new Uri(apiBase);
Console.WriteLine($"API base: {apiBase}");

var books = await client.GetFromJsonAsync<List<BookDto>>("/books");
Console.WriteLine($"Books count: {books?.Count}");

var newBook = new BookCreateDto{ Title = "Client Created Book", AuthorId = 1, Isbn = "CL-123", Price = 4.99M, PublishedDate = DateTime.UtcNow };
var postResp = await client.PostAsJsonAsync("/books", newBook);
var created = await postResp.Content.ReadFromJsonAsync<BookDto>();
Console.WriteLine($"Created book id: {created?.Id}");

if (created != null) {
    var id = created.Id;
    var got = await client.GetFromJsonAsync<BookDto>($"/books/{id}");
    Console.WriteLine($"Got book: {got?.Title}");
    var replace = new BookCreateDto{ Title = "Replaced by Client", AuthorId = 1, Isbn = "REP-1", Price=9.99M, PublishedDate = DateTime.UtcNow };
    var putResp = await client.PutAsJsonAsync($"/books/{id}", replace);
    Console.WriteLine($"PUT status: {putResp.StatusCode}");
    var patch = new { Price = 1.23M };
    var patchReq = new HttpRequestMessage(HttpMethod.Patch, $"/books/{id}") { Content = JsonContent.Create(patch) };
    var patchResp = await client.SendAsync(patchReq);
    Console.WriteLine($"PATCH status: {patchResp.StatusCode}");
    var delResp = await client.DeleteAsync($"/books/{id}");
    Console.WriteLine($"DELETE status: {delResp.StatusCode}");
}

Console.WriteLine("Client done.");

public class BookCreateDto { public string Title { get; set; } = string.Empty; public int AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
public class BookDto { public int Id { get; set; } public string Title { get; set; } = string.Empty; public int AuthorId { get; set; } public string? Isbn { get; set; } public decimal? Price { get; set; } public DateTime? PublishedDate { get; set; } }
