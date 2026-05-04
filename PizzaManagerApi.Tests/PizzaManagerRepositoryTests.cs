using FluentAssertions;
using PizzaManagerApi.Repositories;
using PizzaManagerApi.DTOs;
using Dapper;

namespace PizzaManagerApi.Tests;

public class PizzaManagerRepositoryTests : IntegrationTestBase
{
    private PizzsaManagerRepository CreateRepository() => new(_dataSource);

    [Fact]
    public async Task CreateAsync_ShouldInsertFullPizzaData()
    {
        // Arrange
        var repo = CreateRepository();
        var dto = new CreatePizzaDto(
            Name: "Карбонара",
            Description: "Сливочный соус",
            Image: "carbonara.jpg",
            CategoryIds: [1, 2], // Мясная, Острая (из твоего SQL)
            IngredientIds: [1, 3], // Моцарелла, Томаты
            Variants: [
                new PizzaVariantDto(PizzaSize.S, 300, 450m, true),
                new PizzaVariantDto(PizzaSize.M, 450, 600m, true)
            ]
        );

        // Act
        var id = await repo.CreateAsync(dto);

        // Assert
        var pizza = await repo.GetByIdAsync(id);
        pizza.Should().NotBeNull();
        pizza!.Name.Should().Be("Карбонара");
        pizza.CategoriesJson.Should().Contain("Мясная").And.Contain("Острая");
        pizza.IngredientsJson.Should().Contain("Моцарелла").And.Contain("Томаты");
        pizza.VariantsJson.Should().Contain("300").And.Contain("450");
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllPizzasWithDetails()
    {
        // Arrange
        var repo = CreateRepository();
        await repo.CreateAsync(new CreatePizzaDto("Пицца 1", "Д", "и1", [1], [1], []));
        await repo.CreateAsync(new CreatePizzaDto("Пицца 2", "Д", "и2", [2], [2], []));

        // Act
        var result = await repo.GetAllAsync();

        // Assert
        result.Should().HaveCountGreaterThanOrEqualTo(2);
        result.Should().Contain(p => p.Name == "Пицца 1");
        result.Should().Contain(p => p.Name == "Пицца 2");
    }

    [Fact]
    public async Task UpdateAsync_ShouldModifyExistingPizzaAndRefreshRelations()
    {
        // Arrange
        var repo = CreateRepository();
        var id = await repo.CreateAsync(new CreatePizzaDto("Старая", "О", "ф", [1], [1], [new(PizzaSize.S, 1, 1, true)]));

        var updateDto = new CreatePizzaDto(
            Name: "Новая",
            Description: "Обновлено",
            Image: "new.jpg",
            CategoryIds: [3], // Веган
            IngredientIds: [4], // Грибы
            Variants: [new PizzaVariantDto(PizzaSize.L, 600, 900m, false)]
        );

        // Act
        var isUpdated = await repo.UpdateAsync(id, updateDto);

        // Assert
        isUpdated.Should().BeTrue();
        var updated = await repo.GetByIdAsync(id);
        updated!.Name.Should().Be("Новая");
        updated.Description.Should().Be("Обновлено");
        updated.CategoriesJson.Should().Contain("Веган").And.NotContain("Мясная");
        updated.IngredientsJson.Should().Contain("Грибы");
        updated.VariantsJson.Should().Contain("L").And.Contain("900");
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnFalse_WhenPizzaDoesNotExist()
    {
        // Arrange
        var repo = CreateRepository();
        var dto = new CreatePizzaDto("??", "", "", [], [], []);

        // Act
        var result = await repo.UpdateAsync(9999, dto);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemovePizzaAndAllAssociatedData()
    {
        // Arrange
        var repo = CreateRepository();
        var id = await repo.CreateAsync(new CreatePizzaDto(
            "На удаление", "О", "ф", [1], [1], [new(PizzaSize.S, 1, 1, true)]
        ));

        // Act
        var isDeleted = await repo.DeleteAsync(id);

        // Assert
        isDeleted.Should().BeTrue();
        
        // Проверяем, что в самой таблице пицц пусто
        var pizza = await repo.GetByIdAsync(id);
        pizza.Should().BeNull();

        // Проверяем каскадное удаление в вариантах вручную через соединение
        using var conn = await _dataSource.OpenConnectionAsync();
        var variantsCount = await conn.ExecuteScalarAsync<int>(
            "SELECT count(*) FROM pizza_variants WHERE pizza_id = @id", new { id });
        variantsCount.Should().Be(0);
    }
}
