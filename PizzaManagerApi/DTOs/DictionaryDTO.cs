namespace PizzaManagerApi.DTOs;

public record CategoryDto(
    int Id,
    string Name
);

public record IngredientDto(
    int Id,
    string Name
);

public record CustomerDto(
    int Id,
    string Name,
    string Phone,
    string Address
);

public record CourierDto(
    int Id,
    string Name,
    string Phone,
    string Status
);