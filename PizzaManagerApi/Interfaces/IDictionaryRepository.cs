using PizzaManagerApi.Models;

namespace PizzaManagerApi.Interfaces;

public interface IDictionaryRepository
{
    Task<IEnumerable<CategoryEntity>> GetAllCategoriesAsync();
    Task<IEnumerable<IngredientEntity>> GetAllIngredientsAsync();
    Task<IEnumerable<CustomerEntity>> GetAllCustomersAsync();
    Task<IEnumerable<CourierEntity>> GetAllCouriersAsync();
}