using Moq;
using FluentAssertions;
using PizzaManagerApi.Services;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;
using System.Text.Json;

namespace PizzaManagerApi.Tests;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repositoryMock;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _repositoryMock = new Mock<IOrderRepository>();
        _service = new OrderService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllOrders_ShouldMapJsonFieldsCorrectly()
    {
        // Arrange
        var history = new List<OrderHistoryItem> 
        { 
            new("new", "Заказ создан", "2023-10-10", "System") 
        };
        var items = new List<OrderItemDto> 
        { 
            new(1, "Margarita", "M", 2, 1200m) 
        };

        var entities = new List<OrderEntity>
        {
            new() {
                Id = 1,
                CreatedAt = DateTime.Now,
                CustomerName = "Ivan",
                CustomerPhone = "123",
                DeliveryType = "delivery",
                Address = "Street 1",
                Status = "new",
                TotalPrice = 1200m,
                HistoryJson = JsonSerializer.Serialize(history),
                ItemsJson = JsonSerializer.Serialize(items)
            }
        };

        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(entities);

        // Act
        var result = await _service.GetAllOrders();

        // Assert
        var order = result.First();
        order.History.Should().HaveCount(1);
        order.History.First().Label.Should().Be("Заказ создан");
        order.Items.Should().HaveCount(1);
        order.Items.First().PizzaName.Should().Be("Margarita");
    }

    [Fact]
    public async Task CreateOrder_ShouldCallRepositoryAndReturnMappedOrder()
    {
        // Arrange
        var dto = new CreateOrderDto(1, "pickup", "Shop", new());
        var createdEntity = new OrderEntity 
        { 
            Id = 55, 
            CustomerName = "Petr", 
            CustomerPhone = "555",
            DeliveryType = "pickup",
            Address = "Shop",
            Status = "new",
            HistoryJson = "[]",
            ItemsJson = "[]"
        };

        _repositoryMock.Setup(r => r.CreateAsync(dto)).ReturnsAsync(55);
        _repositoryMock.Setup(r => r.GetByIdAsync(55)).ReturnsAsync(createdEntity);

        // Act
        var result = await _service.CreateOrder(dto);

        // Assert
        result.Id.Should().Be(55);
        result.CustomerName.Should().Be("Petr");
        _repositoryMock.Verify(r => r.CreateAsync(dto), Times.Once);
    }

    [Fact]
    public async Task GetOrderById_ShouldReturnNull_WhenNotFound()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                       .ReturnsAsync((OrderEntity?)null);

        // Act
        var result = await _service.GetOrderById(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task ChangeOrderStatus_ShouldForwardRequestToRepository()
    {
        // Arrange
        var request = new UpdateOrderStatusRequestDto("cooking", "Готовится", "Admin");
        _repositoryMock.Setup(r => r.UpdateStatusAsync(10, "cooking", "Готовится", "Admin"))
                       .ReturnsAsync(true);

        // Act
        var result = await _service.ChangeOrderStatus(10, request);

        // Assert
        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.UpdateStatusAsync(10, "cooking", "Готовится", "Admin"), Times.Once);
    }

    [Fact]
    public async Task MapToResponse_ShouldHandleEmptyItems()
    {
        // Arrange
        var entity = new OrderEntity 
        { 
            Id = 1, CustomerName = "X", CustomerPhone = "0", 
            DeliveryType = "p", Address = "A", Status = "s",
            HistoryJson = "[]", 
            ItemsJson = null // Имитируем отсутствие данных в JSON-поле
        };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<OrderEntity> { entity });

        // Act
        var result = await _service.GetAllOrders();

        // Assert
        result.First().Items.Should().NotBeNull().And.BeEmpty();
    }
}
