using FluentAssertions;
using PizzaManagerApi.Repositories;
using PizzaManagerApi.DTOs;
using Dapper;

namespace PizzaManagerApi.Tests;

public class OrderRepositoryTests : IntegrationTestBase
{
    private OrderRepository CreateRepository() => new(_dataSource);

    [Fact]
    public async Task CreateAsync_ShouldCalculatePriceAndPersistOrder()
    {
        // Arrange
        var repo = CreateRepository();
        
        // Нам нужны данные в таблицах pizzas и pizza_variants, 
        // так как репозиторий берет цену из базы
        using (var conn = await _dataSource.OpenConnectionAsync())
        {
            await conn.ExecuteAsync(@"
                INSERT INTO pizzas (id, name) VALUES (100, 'Маргарита');
                INSERT INTO pizza_variants (pizza_id, size, weight, price) 
                VALUES (100, 'M', 400, 500.00);");
        }

        var dto = new CreateOrderDto(
            CustomerId: 1, // Создан в 0002_OrdersSchema.sql (Иван)
            DeliveryType: "delivery",
            Address: "Тестовый адрес",
            Items: [ new CreateOrderItemDto(100, PizzaSize.M, 2) ]
        );

        // Act
        var orderId = await repo.CreateAsync(dto);

        // Assert
        var order = await repo.GetByIdAsync(orderId);
        order.Should().NotBeNull();
        order!.TotalPrice.Should().Be(1000m); // 500 * 2
        order.CustomerName.Should().Be("Иван Иванов");
        order.ItemsJson.Should().Contain("Маргарита");
        order.HistoryJson.Should().Contain("Принят");
    }

    [Fact]
    public async Task UpdateStatusAsync_ShouldAppendToHistory()
    {
        // Arrange
        var repo = CreateRepository();
        var orderId = await repo.CreateAsync(new CreateOrderDto(1, "pickup", "Shop", []));

        // Act
        var result = await repo.UpdateStatusAsync(orderId, "cooking", "Готовится", "Админ");

        // Assert
        result.Should().BeTrue();
        var order = await repo.GetByIdAsync(orderId);
        order!.Status.Should().Be("cooking");
        // Проверяем, что в истории теперь 2 записи (Принят + Готовится)
        order.HistoryJson.Should().Contain("Принят").And.Contain("Готовится");
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnOrdersSortedByDate()
    {
        // Arrange
        var repo = CreateRepository();
        await repo.CreateAsync(new CreateOrderDto(1, "pickup", "A1", []));
        await Task.Delay(100); // Небольшая задержка для разницы во времени
        await repo.CreateAsync(new CreateOrderDto(2, "delivery", "A2", []));

        // Act
        var result = await repo.GetAllAsync();

        // Assert
        var orders = result.ToList();
        orders.Should().HaveCountGreaterThanOrEqualTo(2);
        // Проверка сортировки DESC (новый первый)
        orders[0].CreatedAt.Should().BeAfter(orders[1].CreatedAt);
    }
}
