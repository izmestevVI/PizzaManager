using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;
using System.Text.Json;
using System.Text.Json.Serialization;
using PizzaManagerApi.Models;

namespace PizzaManagerApi.Services;

public class OrderService(IOrderRepository orderRepository): IOrderService
{
    public async Task<IEnumerable<OrderResponseDto>> GetAllOrders()
    {
        var entities = await orderRepository.GetAllAsync();
        
        // Превращаем каждую сущность из БД в объект для фронтенда
        return entities.Select(MapToResponse);
    }

    public async Task<OrderResponseDto> CreateOrder(CreateOrderDto createOrderDto)
    {
        // 1. Просим репозиторий создать заказ в транзакции
        var id = await orderRepository.CreateAsync(createOrderDto);

        // 2. Получаем созданный заказ из базы со всеми связями
        var entity = await orderRepository.GetByIdAsync(id);

        // 3. Мапим в ответ
        return MapToResponse(entity!);
    }

    public async Task<OrderResponseDto?> GetOrderById(int id)
    {
        var entity = await orderRepository.GetByIdAsync(id);
        if (entity == null) return null;

        return MapToResponse(entity);
    }

    public async Task<bool> ChangeOrderStatus(int id, UpdateOrderStatusRequestDto request)
    {
        return await orderRepository.UpdateStatusAsync(id, request.Status, request.Label, request.UpdatedBy);
    }

    private OrderResponseDto MapToResponse(OrderEntity entity)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        options.Converters.Add(new JsonStringEnumConverter());

        return new OrderResponseDto(
            Id: entity.Id,
            CreatedAt: entity.CreatedAt,
            CustomerName: entity.CustomerName,
            CustomerPhone: entity.CustomerPhone,
            CourierName: entity.CourierName,
            DeliveryType: entity.DeliveryType,
            Address: entity.Address,
            Status: entity.Status,
            TotalPrice: entity.TotalPrice,
            History: JsonSerializer.Deserialize<List<OrderHistoryItem>>(entity.HistoryJson, options) ?? [],
            Items: JsonSerializer.Deserialize<List<OrderItemDto>>(entity.ItemsJson ?? "[]", options) ?? []
        );
    }
}