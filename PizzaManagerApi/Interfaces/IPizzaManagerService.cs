using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Interfaces;
public interface IPizzaManagerService
{
    Task<IEnumerable<PizzaResponseDto>> GetAllPizzas();
    Task<PizzaResponseDto?> GetPizzaById(int id);
    Task<PizzaResponseDto> CreatePizza(CreatePizzaDto createPizzaDto);
    Task<bool> UpdatePizza(int id, CreatePizzaDto createPizzaDto);
    Task<bool> DeletePizza(int id);
}