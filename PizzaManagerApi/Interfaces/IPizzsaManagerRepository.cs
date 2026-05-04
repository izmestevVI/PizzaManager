using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Interfaces;

public interface IPizzaManagerRepository
{
    Task<IEnumerable<PizzaEntity>> GetAllAsync();
    Task<PizzaEntity?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreatePizzaDto dto); // Возвращаем ID созданной записи
    Task<bool> UpdateAsync(int id, CreatePizzaDto dto);
    Task<bool> DeleteAsync(int id);
}