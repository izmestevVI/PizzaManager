using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Interfaces;

public interface IOrderRepository
{
    Task<IEnumerable<OrderEntity>> GetAllAsync();
    Task<OrderEntity?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreateOrderDto dto);
    Task<bool> UpdateStatusAsync(int id, string newStatus, string label, string updatedBy);
}
