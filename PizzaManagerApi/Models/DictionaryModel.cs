namespace PizzaManagerApi.Models;

public class CategoryEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
}

public class IngredientEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
}

public class CustomerEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Phone { get; set; }
    public required string Address { get; set; }
}

public class CourierEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Phone { get; set; }
    public required string Status { get; set; }
}