using System.Text.Json;
using System.Text.Json.Serialization;
using PizzaManagerApi.DTOs;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;

namespace PizzaManagerApi.Services;

public class PizzaManagerService(IPizzaManagerRepository _repository) : IPizzaManagerService
{
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };
    
    public async Task<IEnumerable<PizzaResponseDto>> GetAllPizzas()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(MapToResponse);
    }

    public async Task<PizzaResponseDto?> GetPizzaById(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity == null ? null : MapToResponse(entity);
    }

    public async Task<PizzaResponseDto> CreatePizza(CreatePizzaDto createPizzaDto)
    {
        var id = await _repository.CreateAsync(createPizzaDto);
        var entity = await _repository.GetByIdAsync(id);
        
        return MapToResponse(entity!);
    }

    public async Task<bool> UpdatePizza(int id, CreatePizzaDto createPizzaDto)
    {
        return await _repository.UpdateAsync(id, createPizzaDto);
    }

    public async Task<bool> DeletePizza(int id)
    {
        return await _repository.DeleteAsync(id);
    }

        // Вспомогательный метод маппинга
    private PizzaResponseDto MapToResponse(PizzaEntity entity)
    {
            // Создаем опции с конвертером для Enum
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        options.Converters.Add(new JsonStringEnumConverter());

        return new PizzaResponseDto(
            Id: entity.Id,
            Name: entity.Name,
            Description: entity.Description,
            Image: entity.ImageUrl,
            // Десериализуем JSON из базы в объекты C#
            Categories: JsonSerializer.Deserialize<List<string>>(entity.CategoriesJson ?? "[]", options) ?? new(),
            Variants: JsonSerializer.Deserialize<List<PizzaVariantDto>>(entity.VariantsJson ?? "[]", options) ?? new(),
            //Ingredients: entity.IngredientIds?.ToList() ?? new()
            Ingredients: JsonSerializer.Deserialize<List<string>>(entity.IngredientsJson ?? "[]", options) ?? new()
        );
    }
}