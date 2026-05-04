using Dapper;
using Npgsql;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;

namespace PizzaManagerApi.Repositories;

public class PizzsaManagerRepository(NpgsqlDataSource _dataSource): IPizzaManagerRepository
{

    public async Task<IEnumerable<PizzaEntity>> GetAllAsync()
    {
        using var db = await _dataSource.OpenConnectionAsync();
        
        // Используем агрегацию в JSON прямо в SQL
        const string sql = @"
            SELECT 
                p.id, p.name, p.description, p.image_url as ImageUrl,
                (SELECT json_agg(c.name) FROM pizza_categories pc 
                 JOIN categories c ON c.id = pc.category_id WHERE pc.pizza_id = p.id) as CategoriesJson,
                (SELECT json_agg(json_build_object(
                    'size', pv.size, 'weight', pv.weight, 'price', pv.price, 'inStock', pv.in_stock
                 )) FROM pizza_variants pv WHERE pv.pizza_id = p.id) as VariantsJson,
                (SELECT json_agg(i.name) 
                 FROM pizza_ingredients pi 
                 JOIN ingredients i ON i.id = pi.ingredient_id 
                 WHERE pi.pizza_id = p.id) as IngredientsJson
            FROM pizzas p";

        return await db.QueryAsync<PizzaEntity>(sql);
    }

    public async Task<PizzaEntity?> GetByIdAsync(int id)
    {
        using var db = await _dataSource.OpenConnectionAsync();
        
        const string sql = @"
            SELECT 
                p.id, p.name, p.description, p.image_url as ImageUrl,
                (SELECT json_agg(c.name) FROM pizza_categories pc 
                 JOIN categories c ON c.id = pc.category_id WHERE pc.pizza_id = p.id) as CategoriesJson,
                (SELECT json_agg(json_build_object(
                    'size', pv.size, 'weight', pv.weight, 'price', pv.price, 'inStock', pv.in_stock
                 )) FROM pizza_variants pv WHERE pv.pizza_id = p.id) as VariantsJson,
                (SELECT json_agg(i.name) 
                 FROM pizza_ingredients pi 
                 JOIN ingredients i ON i.id = pi.ingredient_id 
                 WHERE pi.pizza_id = p.id) as IngredientsJson
            FROM pizzas p
            WHERE p.id = @id";

        return await db.QueryFirstOrDefaultAsync<PizzaEntity>(sql, new { id });
    }

    public async Task<int> CreateAsync(CreatePizzaDto dto)
    {
        using var db = await _dataSource.OpenConnectionAsync();
        using var transaction = await db.BeginTransactionAsync();

        try
        {
            // 1. Вставляем основную запись
            const string pizzaSql = @"
                INSERT INTO pizzas (name, description, image_url) 
                VALUES (@Name, @Description, @Image) 
                RETURNING id";
            
            var pizzaId = await db.ExecuteScalarAsync<int>(pizzaSql, dto, transaction);

            // 2. Вставляем варианты (используем возможности Dapper для коллекций)
            const string variantSql = @"
            INSERT INTO pizza_variants (pizza_id, size, weight, price, in_stock) 
            VALUES (@PizzaId, @Size::pizza_size, @Weight, @Price, @InStock)"; // Добавили ::pizza_size

            var variantsToInsert = dto.Variants.Select(v => new { 
                PizzaId = pizzaId, 
                Size = v.Size.ToString(), // ПЕРЕДАЕМ СТРОКУ "S", "M" или "L"
                v.Weight, 
                v.Price, 
                v.InStock 
            });
            await db.ExecuteAsync(variantSql, variantsToInsert, transaction);

            // 3. Вставляем связи с категориями
            const string categorySql = @"
                INSERT INTO pizza_categories (pizza_id, category_id) 
                VALUES (@PizzaId, @CategoryId)";
            
            await db.ExecuteAsync(categorySql, 
                dto.CategoryIds.Select(cId => new { PizzaId = pizzaId, CategoryId = cId }), 
                transaction);

            const string ingredientSql = @"
                INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
                VALUES (@PizzaId, @IngredientId)";

            await db.ExecuteAsync(ingredientSql, 
                dto.IngredientIds.Select(iId => new { PizzaId = pizzaId, IngredientId = iId }), 
                transaction);

            await transaction.CommitAsync();
            return pizzaId;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> UpdateAsync(int id, CreatePizzaDto dto)
    {
        using var db = await _dataSource.OpenConnectionAsync();
        using var transaction = await db.BeginTransactionAsync();

        try
        {
            // Обновляем основные поля
            const string updatePizzaSql = @"
                UPDATE pizzas 
                SET name = @Name, description = @Description, image_url = @Image 
                WHERE id = @id";
            var affectedRows = await db.ExecuteAsync(updatePizzaSql, new { dto.Name, dto.Description, dto.Image, id }, transaction);
            
            if (affectedRows == 0) return false;

            // Синхронизируем варианты: удаляем старые и вставляем новые
            await db.ExecuteAsync("DELETE FROM pizza_variants WHERE pizza_id = @id", new { id }, transaction);
            /*const string variantSql = @"
                INSERT INTO pizza_variants (pizza_id, size, weight, price, in_stock) 
                VALUES (@id, @Size::pizza_size, @Weight, @Price, @InStock)";
            await db.ExecuteAsync(variantSql, dto.Variants.Select(v => new { id, v.Size, v.Weight, v.Price, v.InStock }), transaction);*/
            const string variantSql = @"
                INSERT INTO pizza_variants (pizza_id, size, weight, price, in_stock) 
                VALUES (@id, @Size::pizza_size, @Weight, @Price, @InStock)";

            // Очень важно: .ToList() в конце, чтобы зафиксировать проекцию
            var variantsToInsert = dto.Variants.Select(v => new { 
                id = id,                        // Связываем с ID пиццы
                Size = v.Size.ToString(),       // Гарантируем строку "S", "M" или "L"
                Weight = v.Weight, 
                Price = v.Price, 
                InStock = v.InStock 
            }).ToList(); 

            await db.ExecuteAsync(variantSql, variantsToInsert, transaction);

            // Синхронизируем категории
            await db.ExecuteAsync("DELETE FROM pizza_categories WHERE pizza_id = @id", new { id }, transaction);
            const string categorySql = "INSERT INTO pizza_categories (pizza_id, category_id) VALUES (@id, @CategoryId)";
            await db.ExecuteAsync(categorySql, dto.CategoryIds.Select(cId => new { id, CategoryId = cId }), transaction);

            // Синхронизируем ингредиенты
            await db.ExecuteAsync("DELETE FROM pizza_ingredients WHERE pizza_id = @id", new { id }, transaction);
            const string ingredientSql = "INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (@id, @IngId)";
            await db.ExecuteAsync(ingredientSql, dto.IngredientIds.Select(iId => new { id, IngId = iId }), transaction);

            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var db = await _dataSource.OpenConnectionAsync();
        
        // Благодаря ON DELETE CASCADE в структуре таблиц, 
        // связанные записи в pizza_variants и pizza_categories удалятся автоматически
        const string sql = "DELETE FROM pizzas WHERE id = @id";
        var affectedRows = await db.ExecuteAsync(sql, new { id });
        
        return affectedRows > 0;
    }
}