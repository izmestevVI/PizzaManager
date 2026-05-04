using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.Controllers;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Tests;

public class PizzaManagerControllerTests
{
    private readonly Mock<IPizzaManagerService> _serviceMock;
    private readonly PizzaManagerController _controller;

    public PizzaManagerControllerTests()
    {
        _serviceMock = new Mock<IPizzaManagerService>();
        _controller = new PizzaManagerController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAllPizzas_ShouldReturnOkWithData()
    {
        // Arrange
        var pizzas = new List<PizzaResponseDto> 
        { 
            new(1, "Pepperoni", "Hot", "url", new(), new(), new()) 
        };
        _serviceMock.Setup(s => s.GetAllPizzas()).ReturnsAsync(pizzas);

        // Act
        var result = await _controller.GetAllPizzas();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(pizzas);
    }

    [Fact]
    public async Task GetPizzaById_ShouldReturnNotFound_WhenPizzaDoesNotExist()
    {
        // Arrange
        _serviceMock.Setup(s => s.GetPizzaById(99)).ReturnsAsync((PizzaResponseDto?)null);

        // Act
        var result = await _controller.GetPizzaById(99);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task CreatePizza_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var dto = new CreatePizzaDto("New", "Desc", "img", new(), new(), new());
        var created = new PizzaResponseDto(10, "New", "Desc", "img", new(), new(), new());
        _serviceMock.Setup(s => s.CreatePizza(dto)).ReturnsAsync(created);

        // Act
        var result = await _controller.CreatePizza(dto);

        // Assert
        var createdResult = result.Result.As<CreatedAtActionResult>();
        createdResult.StatusCode.Should().Be(201);
        createdResult.ActionName.Should().Be(nameof(_controller.GetPizzaById));
        createdResult.RouteValues!["id"].Should().Be(10);
    }

    [Fact]
    public async Task UpdatePizza_ShouldReturnNoContent_WhenSuccess()
    {
        // Arrange
        var dto = new CreatePizzaDto("Upd", "Desc", "img", new(), new(), new());
        _serviceMock.Setup(s => s.UpdatePizza(1, dto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdatePizza(1, dto);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeletePizza_ShouldReturnNotFound_WhenFailed()
    {
        // Arrange
        _serviceMock.Setup(s => s.DeletePizza(It.IsAny<int>())).ReturnsAsync(false);

        // Act
        var result = await _controller.DeletePizza(999);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }
}
