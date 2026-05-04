using Moq;
using FluentAssertions;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;
using PizzaManagerApi.Services;


namespace PizzaManagerApi.Tests;

public class PizzaManagerServiceTests
{
    private readonly Mock<IPizzaManagerRepository> _repositoryMock;
    private readonly PizzaManagerService _service;

    public PizzaManagerServiceTests()
    {
        _repositoryMock = new Mock<IPizzaManagerRepository>();
        _service = new PizzaManagerService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllPizzas_ShouldReturnMappedDtos()
    {
        // Arrange
        var entities = new List<PizzaEntity>
        {
            new() { 
                Id = 1, Name = "Margarita", Description = "Desc", ImageUrl = "url",
                CategoriesJson = "[\"Classic\"]", 
                VariantsJson = "[{\"Size\":0, \"Weight\":300, \"Price\":10, \"InStock\":true}]", 
                IngredientsJson = "[\"Tomato\"]" 
            }
        };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllPizzas();

        // Assert
        result.Should().HaveCount(1);
        var pizza = result.First();
        pizza.Name.Should().Be("Margarita");
        pizza.Categories.Should().Contain("Classic");
        pizza.Variants.Should().NotBeEmpty();
        pizza.Variants.First().Size.Should().Be(PizzaSize.S);
    }

    [Fact]
    public async Task GetPizzaById_ShouldReturnDto_WhenExists()
    {
        // Arrange
        var entity = new PizzaEntity { 
            Id = 1, Name = "Test", IngredientsJson = "[]", 
            CategoriesJson = "[]", VariantsJson = "[]" 
        };
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

        // Act
        var result = await _service.GetPizzaById(1);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetPizzaById_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((PizzaEntity?)null);

        // Act
        var result = await _service.GetPizzaById(99);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreatePizza_ShouldReturnCreatedPizzaResponse()
    {
        // Arrange
        var dto = new CreatePizzaDto("New", "Desc", "img", new(), new(), new());
        var createdEntity = new PizzaEntity { 
            Id = 10, Name = "New", IngredientsJson = "[]", 
            CategoriesJson = "[]", VariantsJson = "[]" 
        };

        _repositoryMock.Setup(r => r.CreateAsync(dto)).ReturnsAsync(10);
        _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(createdEntity);

        // Act
        var result = await _service.CreatePizza(dto);

        // Assert
        result.Id.Should().Be(10);
        result.Name.Should().Be("New");
        _repositoryMock.Verify(r => r.CreateAsync(dto), Times.Once);
    }

    [Fact]
    public async Task UpdatePizza_ShouldReturnTrue_WhenSuccess()
    {
        // Arrange
        var dto = new CreatePizzaDto("Update", "Desc", "img", new(), new(), new());
        _repositoryMock.Setup(r => r.UpdateAsync(1, dto)).ReturnsAsync(true);

        // Act
        var result = await _service.UpdatePizza(1, dto);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task DeletePizza_ShouldReturnFalse_WhenNotFound()
    {
        // Arrange
        _repositoryMock.Setup(r => r.DeleteAsync(99)).ReturnsAsync(false);

        // Act
        var result = await _service.DeletePizza(99);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task MapToResponse_ShouldHandleNullJsonFields()
    {
        // Arrange
        var entity = new PizzaEntity 
        { 
            Id = 1, Name = "NullTest", 
            IngredientsJson = null!, 
            CategoriesJson = null!, 
            VariantsJson = null! 
        };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<PizzaEntity> { entity });

        // Act
        var result = await _service.GetAllPizzas();

        // Assert
        var pizza = result.First();
        pizza.Ingredients.Should().NotBeNull().And.BeEmpty();
        pizza.Categories.Should().NotBeNull().And.BeEmpty();
        pizza.Variants.Should().NotBeNull().And.BeEmpty();
    }
}