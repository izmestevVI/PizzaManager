using Testcontainers.PostgreSql;
using Npgsql;
using Dapper;

namespace PizzaManagerApi.Tests;

public abstract class IntegrationTestBase : IAsyncLifetime
{
    protected readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder("postgres:18-alpine")
    .Build();

    protected NpgsqlDataSource _dataSource = null!;

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        _dataSource = NpgsqlDataSource.Create(_dbContainer.GetConnectionString());

        // 1. Находим путь к папке Scripts (поднимаемся из bin/Debug/... к корню проекта)
        var projectDir = Directory.GetParent(AppContext.BaseDirectory)!.Parent!.Parent!.Parent!.FullName;
        var scriptsDir = Path.Combine(projectDir, "..", "PizzaManagerApi", "Scripts"); 
        
        // 2. Читаем файлы в алфавитном порядке
        var scriptFiles = Directory.GetFiles(scriptsDir, "*.sql").OrderBy(f => f);

        using var conn = await _dataSource.OpenConnectionAsync();
        foreach (var file in scriptFiles)
        {
            var sql = await File.ReadAllTextAsync(file);
            await conn.ExecuteAsync(sql);
        }
    }

    public async Task DisposeAsync() => await _dbContainer.DisposeAsync();
}
