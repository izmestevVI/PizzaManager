using PizzaManagerApi.Models;

namespace PizzaManagerApi.DTOs;

public record CreateOrderDto(
    int CustomerId,
    string DeliveryType, // 'delivery' или 'pickup'
    string Address,
    List<CreateOrderItemDto> Items
);

public record CreateOrderItemDto(
    int PizzaId,
    PizzaSize Size,
    int Count
);

public record OrderResponseDto(
    int Id,
    DateTime CreatedAt,
    string CustomerName,
    string CustomerPhone,
    string? CourierName,
    string DeliveryType,
    string Address,
    string Status,
    decimal TotalPrice,
    List<OrderItemDto> Items,
    List<OrderHistoryItem> History
);

public record OrderItemDto(
    int PizzaId,
    string PizzaName,
    string Size,
    int Count,
    decimal Price
);

public record UpdateOrderStatusRequestDto(
    string Status,
    string Label,
    string UpdatedBy
);
