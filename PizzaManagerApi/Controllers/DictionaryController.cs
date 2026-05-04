using Microsoft.AspNetCore.Mvc;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Controllers;

[ApiController]
[Route("api/dictionary")]
public class DictionaryController(IDictionaryService _dictionaryService): ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _dictionaryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("ingredients")]
    public async Task<ActionResult<IEnumerable<IngredientDto>>> GetIngredients()
    {
        var ingredients = await _dictionaryService.GetAllIngredientsAsync();
        return Ok(ingredients);
    }

    [HttpGet("customers")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
    {
        var customers = await _dictionaryService.GetAllCustomersAsync();
        return Ok(customers);
    }

    [HttpGet("couriers")]
    public async Task<ActionResult<IEnumerable<CourierDto>>> GetCouriers()
    {
        var couriers = await _dictionaryService.GetAllCouriersAsync();
        return Ok(couriers);
    }
}