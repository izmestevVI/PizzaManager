using Dapper;
using Npgsql;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;

namespace PizzaManagerApi.Repositories;

public class DictionaryRepository(NpgsqlDataSource _dataSource) : IDictionaryRepository
{
    public async Task<IEnumerable<CategoryEntity>> GetAllCategoriesAsync()
    {
        using var db = await _dataSource.OpenConnectionAsync();
        return await db.QueryAsync<CategoryEntity>("SELECT id, name FROM categories");
    }

    public async Task<IEnumerable<IngredientEntity>> GetAllIngredientsAsync()
    {
        using var db = await _dataSource.OpenConnectionAsync();
        return await db.QueryAsync<IngredientEntity>("SELECT id, name FROM ingredients");
    }

    public async Task<IEnumerable<CustomerEntity>> GetAllCustomersAsync()
    {
        using var db = await _dataSource.OpenConnectionAsync();
        return await db.QueryAsync<CustomerEntity>("SELECT id, name, phone, address FROM customers");
    }

    public async Task<IEnumerable<CourierEntity>> GetAllCouriersAsync()
    {
        using var db = await _dataSource.OpenConnectionAsync();
        return await db.QueryAsync<CourierEntity>("SELECT id, name, phone, status::text FROM couriers");
    }
}