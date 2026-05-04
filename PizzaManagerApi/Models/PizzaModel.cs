namespace PizzaManagerApi.Models;

public class PizzaEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string CategoriesJson { get; set; }  = null!;
    public string VariantsJson { get; set; } = null!;
    public required string IngredientsJson { get; set; } 
}