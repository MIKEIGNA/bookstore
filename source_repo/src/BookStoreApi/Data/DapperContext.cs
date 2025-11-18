using Npgsql;
namespace BookStoreApi.Data;
public class DapperContext
{
    private readonly IConfiguration _config;
    public string ConnectionString { get; }
    public DapperContext(IConfiguration config)
    {
        _config = config;
        var env = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrEmpty(env)) { ConnectionString = env; }
        else { ConnectionString = _config.GetConnectionString("DefaultConnection") ?? "Host=postgres;Port=5432;Database=bookstore;Username=postgres;Password=postgres"; }
    }
    public NpgsqlConnection CreateConnection() => new NpgsqlConnection(ConnectionString);
}
