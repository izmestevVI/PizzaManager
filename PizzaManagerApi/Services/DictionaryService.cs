using PizzaManagerApi.DTOs;
using PizzaManagerApi.Interfaces;

namespace PizzaManagerApi.Services;

public class DictionaryService(IDictionaryRepository _dictionaryRepository) : IDictionaryService
{
    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _dictionaryRepository.GetAllCategoriesAsync();
        return categories.Select(c => new CategoryDto(Id: c.Id, Name: c.Name));
    }

    public async Task<IEnumerable<IngredientDto>> GetAllIngredientsAsync()
    {
        var ingredients = await _dictionaryRepository.GetAllIngredientsAsync();
        return ingredients.Select(i => new IngredientDto(Id: i.Id, Name: i.Name));
    }

    public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
    {
        var customers = await _dictionaryRepository.GetAllCustomersAsync();
        return customers.Select(c => new CustomerDto(Id: c.Id, Name: c.Name, Phone: c.Phone, Address: c.Address));
    }

    public async Task<IEnumerable<CourierDto>> GetAllCouriersAsync()
    {
        var couriers = await _dictionaryRepository.GetAllCouriersAsync();
        return couriers.Select(c => new CourierDto(Id: c.Id, Name: c.Name, Phone: c.Phone, Status: c.Status));
    }
}