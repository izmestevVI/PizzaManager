using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.DTOs;
using PizzaManagerApi.Interfaces;

namespace PizzaManagerApi.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(IOrderService _orderService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAll()
    {
        var orders = await _orderService.GetAllOrders();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetById(int id)
    {
        var order = await _orderService.GetOrderById(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> Create([FromBody] CreateOrderDto createOrderDto)
    {
        try
        {
            var result = await _orderService.CreateOrder(createOrderDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            // Здесь можно добавить логирование ошибки
            return BadRequest(new { message = "Ошибка при создании заказа", error = ex.Message });
        }
    }
    
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequestDto request)
    {
        var result = await _orderService.ChangeOrderStatus(id, request);
        if (!result) return NotFound();
        
        return NoContent();
    }
}