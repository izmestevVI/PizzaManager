namespace PizzaManagerApi.DTOs;

public enum PizzaSize
{
    S,
    M,
    L
};

public record PizzaVariantDto(
    PizzaSize Size,
    int Weight,
    decimal Price,
    bool InStock
);

public record CreatePizzaDto(
    string Name,
    string Description,
    string Image,
    List<int> CategoryIds,      // Список ID категорий из справочника
    List<int> IngredientIds,    // Список ID ингредиентов
    List<PizzaVariantDto> Variants
);

public record PizzaResponseDto(
    int Id,
    string Name,
    string Description,
    string Image,
    List<string> Categories,    // Здесь уже названия строк, а не ID
    List<PizzaVariantDto> Variants,
    List<string> Ingredients
);
