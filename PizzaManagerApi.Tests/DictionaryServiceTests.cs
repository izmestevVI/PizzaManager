using Moq;
using FluentAssertions;
using PizzaManagerApi.Services;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Tests;

public class DictionaryServiceTests
{
    private readonly Mock<IDictionaryRepository> _repositoryMock;
    private readonly DictionaryService _service;

    public DictionaryServiceTests()
    {
        _repositoryMock = new Mock<IDictionaryRepository>();
        _service = new DictionaryService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldMapCorrectly()
    {
        // Arrange
        var entities = new List<CategoryEntity>
        {
            new() { Id = 1, Name = "Classic" },
            new() { Id = 2, Name = "Spicy" }
        };
        _repositoryMock.Setup(r => r.GetAllCategoriesAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllCategoriesAsync();

        // Assert
        result.Should().HaveCount(2);
        result.First().Should().BeEquivalentTo(new CategoryDto(1, "Classic"));
    }

    [Fact]
    public async Task GetAllIngredientsAsync_ShouldMapCorrectly()
    {
        // Arrange
        var entities = new List<IngredientEntity>
        {
            new() { Id = 10, Name = "Cheese" }
        };
        _repositoryMock.Setup(r => r.GetAllIngredientsAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllIngredientsAsync();

        // Assert
        result.Should().ContainSingle();
        result.First().Name.Should().Be("Cheese");
    }

    [Fact]
    public async Task GetAllCustomersAsync_ShouldMapAllFields()
    {
        // Arrange
        var entities = new List<CustomerEntity>
        {
            new() { Id = 1, Name = "Ivan", Phone = "123", Address = "Moscow" }
        };
        _repositoryMock.Setup(r => r.GetAllCustomersAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllCustomersAsync();

        // Assert
        var customer = result.First();
        customer.Id.Should().Be(1);
        customer.Name.Should().Be("Ivan");
        customer.Phone.Should().Be("123");
        customer.Address.Should().Be("Moscow");
    }

    [Fact]
    public async Task GetAllCouriersAsync_ShouldMapAllFields()
    {
        // Arrange
        var entities = new List<CourierEntity>
        {
            new() { Id = 5, Name = "Dmitry", Phone = "777", Status = "Active" }
        };
        _repositoryMock.Setup(r => r.GetAllCouriersAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllCouriersAsync();

        // Assert
        var courier = result.First();
        courier.Status.Should().Be("Active");
        courier.Phone.Should().Be("777");
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnEmpty_WhenRepositoryIsEmpty()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetAllCategoriesAsync())
                       .ReturnsAsync(new List<CategoryEntity>());

        // Act
        var result = await _service.GetAllCategoriesAsync();

        // Assert
        result.Should().BeEmpty();
    }
}