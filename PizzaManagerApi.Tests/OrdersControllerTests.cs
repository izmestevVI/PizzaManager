using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.Controllers;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Tests;

public class OrdersControllerTests
{
    private readonly Mock<IOrderService> _serviceMock;
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _serviceMock = new Mock<IOrderService>();
        _controller = new OrdersController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk()
    {
        // Arrange
        var orders = new List<OrderResponseDto> { 
            new(1, DateTime.Now, "Ivan", "123", null, "delivery", "Home", "new", 1000m, [], []) 
        };
        _serviceMock.Setup(s => s.GetAllOrders()).ReturnsAsync(orders);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.As<OkObjectResult>();
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(orders);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenOrderMissing()
    {
        // Arrange
        _serviceMock.Setup(s => s.GetOrderById(99)).ReturnsAsync((OrderResponseDto?)null);

        // Act
        var result = await _controller.GetById(99);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Create_ShouldReturnCreated_WhenSuccessful()
    {
        // Arrange
        var dto = new CreateOrderDto(1, "delivery", "Street", []);
        var response = new OrderResponseDto(10, DateTime.Now, "Ivan", "123", null, "delivery", "Street", "new", 0, [], []);
        _serviceMock.Setup(s => s.CreateOrder(dto)).ReturnsAsync(response);

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var createdResult = result.Result.As<CreatedAtActionResult>();
        createdResult.StatusCode.Should().Be(201);
        createdResult.RouteValues!["id"].Should().Be(10);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenExceptionOccurs()
    {
        // Arrange
        var dto = new CreateOrderDto(1, "delivery", "Street", []);
        _serviceMock.Setup(s => s.CreateOrder(dto)).ThrowsAsync(new Exception("Database error"));

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var badRequestResult = result.Result.As<BadRequestObjectResult>();
        badRequestResult.StatusCode.Should().Be(400);
        // Проверяем, что в ответе есть сообщение об ошибке
        badRequestResult.Value?.ToString().Should().Contain("Ошибка при создании заказа");
    }

    [Fact]
    public async Task UpdateStatus_ShouldReturnNoContent_WhenSuccess()
    {
        // Arrange
        var request = new UpdateOrderStatusRequestDto("cooking", "Готовим", "Admin");
        _serviceMock.Setup(s => s.ChangeOrderStatus(1, request)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateStatus(1, request);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task UpdateStatus_ShouldReturnNotFound_WhenFailed()
    {
        // Arrange
        var request = new UpdateOrderStatusRequestDto("cooking", "Готовим", "Admin");
        _serviceMock.Setup(s => s.ChangeOrderStatus(It.IsAny<int>(), request)).ReturnsAsync(false);

        // Act
        var result = await _controller.UpdateStatus(99, request);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }
}
