using DbUp;
using Npgsql;
using Scalar.AspNetCore;
using System.Reflection;
using System.Text.Json.Serialization;
using PizzaManagerApi.Repositories;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Services;
using PizzaManagerApi.DTOs;

var builder = WebApplication.CreateBuilder(args);

//var connectionString = "Host=localhost;Port=5432;Database=pizza_db;Username=postgres;Password=admin";
// 1. Получаем строку подключения из конфига (лучше, чем хардкод)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=pizza_db;Username=postgres;Password=admin";


EnsureDatabase.For.PostgresqlDatabase(connectionString);
// Отладочный вывод: посмотрим, какие ресурсы видит сборка
var resources = Assembly.GetExecutingAssembly().GetManifestResourceNames();
Console.WriteLine("Список найденных ресурсов:");
foreach (var res in resources) Console.WriteLine($" -> {res}");
var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString)
    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
    .LogToConsole()
    .Build();

if(upgrader.IsUpgradeRequired())
{
    var result = upgrader.PerformUpgrade();
    if (!result.Successful)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Ошибка миграции: " + result.Error);
        Console.ResetColor();
        // Можно прервать запуск, если база не готова
        return; 
    }
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("База данных успешно обновлена!");
Console.ResetColor();

builder.Services.AddControllers().AddJsonOptions(options => {
        // Чтобы Enum (S, M, L) превращались в строки в JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.MapEnum<PizzaSize>(); // Регистрируем ваш Enum
var dataSource = dataSourceBuilder.Build();
builder.Services.AddScoped<IPizzaManagerRepository, PizzsaManagerRepository>(sp => 
    new PizzsaManagerRepository(dataSource));
builder.Services.AddScoped<IDictionaryRepository, DictionaryRepository>(sp => 
    new DictionaryRepository(dataSource));
builder.Services.AddScoped<IOrderRepository, OrderRepository>(sp => 
    new OrderRepository(dataSource));
builder.Services.AddScoped<IPizzaManagerService, PizzaManagerService>();
builder.Services.AddScoped<IDictionaryService, DictionaryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    //app.MapScalarApiReference();
    app.MapScalarApiReference(options => 
    {
        options
            .WithTitle("Pizza Manager API")
            .WithTheme(ScalarTheme.Moon) // Можно выбрать тему: Moon, Solarized, BluePlanet и др.
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.MapControllers(); 

app.Run();
