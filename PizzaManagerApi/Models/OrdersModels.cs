namespace PizzaManagerApi.Models;
public class OrderEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string DeliveryType { get; set; }
    public required string Address { get; set; }
    public required string Status { get; set; }
    public decimal TotalPrice { get; set; }
    public required string HistoryJson { get; set; }
    public string? ItemsJson { get; set; }
    public required string CustomerName { get; set; }
    public required string CustomerPhone { get; set; }
    public string? CourierName { get; set; }
}

public record OrderItemEntity(
    int PizzaId,
    string Size,
    int Count,
    decimal PriceAtPurchase
);

public record OrderHistoryItem(
    string Status,
    string Label,
    string Time,
    string UpdatedBy
);
