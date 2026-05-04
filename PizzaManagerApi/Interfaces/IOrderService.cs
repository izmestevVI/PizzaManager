using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Interfaces;

public interface IOrderService
{
    /// <summary>
    /// Получить список всех заказов с полной информацией (клиент, позиции, история)
    /// </summary>
    Task<IEnumerable<OrderResponseDto>> GetAllOrders();

    /// <summary>
    /// Получить детальную информацию о конкретном заказе
    /// </summary>
    Task<OrderResponseDto?> GetOrderById(int id);

    /// <summary>
    /// Создать новый заказ. Внутри происходит расчет цен и формирование истории.
    /// </summary>
    Task<OrderResponseDto> CreateOrder(CreateOrderDto createOrderDto);

    /// <summary>
    /// Изменить статус заказа и добавить запись в лог истории
    /// </summary>
    Task<bool> ChangeOrderStatus(int id, UpdateOrderStatusRequestDto request);
}