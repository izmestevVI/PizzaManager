using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;
namespace PizzaManagerApi.Controllers;

[ApiController] // ОБЯЗАТЕЛЬНО
[Route("api/pizzas")]
public class PizzaManagerController(IPizzaManagerService _pizzaService): ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PizzaResponseDto>>> GetAllPizzas()
    {
        var pizzas = await _pizzaService.GetAllPizzas();
        return Ok(pizzas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PizzaResponseDto>> GetPizzaById(int id)
    {
        var pizza = await _pizzaService.GetPizzaById(id);
        if (pizza == null)
            return NotFound();
        return Ok(pizza);
    }

    [HttpPost]
    public async Task<ActionResult<PizzaResponseDto>> CreatePizza(CreatePizzaDto createPizzaDto)
    {
        var createdPizza = await _pizzaService.CreatePizza(createPizzaDto);
        return CreatedAtAction(nameof(GetPizzaById), new { id = createdPizza.Id }, createdPizza);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePizza(int id, CreatePizzaDto createPizzaDto)
    {
        var result = await _pizzaService.UpdatePizza(id, createPizzaDto);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePizza(int id)
    {
        var result = await _pizzaService.DeletePizza(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}