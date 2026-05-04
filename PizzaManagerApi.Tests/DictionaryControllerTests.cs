using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.Controllers;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Tests;

public class DictionaryControllerTests
{
    private readonly Mock<IDictionaryService> _serviceMock;
    private readonly DictionaryController _controller;

    public DictionaryControllerTests()
    {
        _serviceMock = new Mock<IDictionaryService>();
        _controller = new DictionaryController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetCategories_ShouldReturnOkWithData()
    {
        // Arrange
        var data = new List<CategoryDto> { new(1, "Classic") };
        _serviceMock.Setup(s => s.GetAllCategoriesAsync()).ReturnsAsync(data);

        // Act
        var result = await _controller.GetCategories();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(data);
    }

    [Fact]
    public async Task GetIngredients_ShouldReturnOkWithData()
    {
        // Arrange
        var data = new List<IngredientDto> { new(1, "Cheese") };
        _serviceMock.Setup(s => s.GetAllIngredientsAsync()).ReturnsAsync(data);

        // Act
        var result = await _controller.GetIngredients();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(data);
    }

    [Fact]
    public async Task GetCustomers_ShouldReturnOkWithData()
    {
        // Arrange
        var data = new List<CustomerDto> { new(1, "Ivan", "123", "Street") };
        _serviceMock.Setup(s => s.GetAllCustomersAsync()).ReturnsAsync(data);

        // Act
        var result = await _controller.GetCustomers();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(data);
    }

    [Fact]
    public async Task GetCouriers_ShouldReturnOkWithData()
    {
        // Arrange
        var data = new List<CourierDto> { new(1, "Dmitry", "777", "Active") };
        _serviceMock.Setup(s => s.GetAllCouriersAsync()).ReturnsAsync(data);

        // Act
        var result = await _controller.GetCouriers();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(data);
    }
}
