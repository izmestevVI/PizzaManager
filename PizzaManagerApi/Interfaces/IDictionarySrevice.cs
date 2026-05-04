using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Interfaces;

public interface IDictionaryService
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
    Task<IEnumerable<IngredientDto>> GetAllIngredientsAsync();
    Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
    Task<IEnumerable<CourierDto>> GetAllCouriersAsync();
}