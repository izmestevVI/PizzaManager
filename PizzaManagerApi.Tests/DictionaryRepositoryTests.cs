using FluentAssertions;
using PizzaManagerApi.Repositories;

namespace PizzaManagerApi.Tests;

public class DictionaryRepositoryTests : IntegrationTestBase
{
    private DictionaryRepository CreateRepository() => new(_dataSource);

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnInitialDataFromSqlScript()
    {
        // Arrange
        var repo = CreateRepository();

        // Act
        var result = await repo.GetAllCategoriesAsync();

        // Assert
        // Проверяем данные, которые ты вставил в скрипте 0001_InitialCreate.sql
        result.Should().NotBeEmpty();
        result.Select(c => c.Name).Should().Contain(new[] { "Мясная", "Острая", "Веган", "Сырная" });
    }

    [Fact]
    public async Task GetAllIngredientsAsync_ShouldReturnInitialDataFromSqlScript()
    {
        // Arrange
        var repo = CreateRepository();

        // Act
        var result = await repo.GetAllIngredientsAsync();

        // Assert
        // Проверяем данные из скрипта 0001_InitialCreate.sql
        result.Should().NotBeEmpty();
        result.Select(i => i.Name).Should().Contain(new[] { "Моцарелла", "Пепперони", "Томаты", "Грибы" });
    }

    [Fact]
    public async Task GetAllCustomersAsync_ShouldReturnInitialDataFromSqlScript()
    {
        // Arrange
        var repo = CreateRepository();

        // Act
        var result = await repo.GetAllCustomersAsync();

        // Assert
        // Проверяем данные из скрипта 0002_OrdersSchema.sql
        result.Should().HaveCountGreaterThanOrEqualTo(2);
        result.Should().Contain(c => c.Name == "Иван Иванов");
        result.Should().Contain(c => c.Phone == "+7 (999) 123-45-67");
    }

    [Fact]
    public async Task GetAllCouriersAsync_ShouldReturnInitialDataFromSqlScript()
    {
        // Arrange
        var repo = CreateRepository();

        // Act
        var result = await repo.GetAllCouriersAsync();

        // Assert
        // Проверяем данные из скрипта 0002_OrdersSchema.sql
        result.Should().HaveCountGreaterThanOrEqualTo(2);
        result.Should().Contain(c => c.Name == "Алексей" && c.Status == "active");
        result.Should().Contain(c => c.Name == "Дмитрий" && c.Status == "on_delivery");
    }
}
