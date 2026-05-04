using Dapper;
using Npgsql;
using PizzaManagerApi.Interfaces;
using PizzaManagerApi.Models;
using PizzaManagerApi.DTOs;
using System.Text.Json;

namespace PizzaManagerApi.Repositories;

public class OrderRepository(NpgsqlDataSource dataSource) : IOrderRepository
{
    public async Task<IEnumerable<OrderEntity>> GetAllAsync()
    {
        using var db = await dataSource.OpenConnectionAsync();
        const string sql = @"
        SELECT 
            o.id,
            o.created_at AS CreatedAt,
            o.delivery_type::text AS DeliveryType,
            o.address,
            o.status::text,
            o.history AS HistoryJson,
            o.total_price AS TotalPrice,
            -- Данные клиента
            c.name AS CustomerName,
            c.phone AS CustomerPhone,
            -- Данные курьера (может быть null)
            co.name AS CourierName,
            -- Собираем массив позиций заказа
            (SELECT json_agg(json_build_object(
                'pizzaId', oi.pizza_id,
                'pizzaName', p.name,
                'size', oi.size,
                'count', oi.count,
                'price', oi.price_at_purchase
            )) 
            FROM order_items oi 
            JOIN pizzas p ON p.id = oi.pizza_id 
            WHERE oi.order_id = o.id) AS ItemsJson
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        LEFT JOIN couriers co ON co.id = o.courier_id
        ORDER BY o.created_at DESC;";

        return await db.QueryAsync<OrderEntity>(sql);
    }

    public async Task<int> CreateAsync(CreateOrderDto dto)
    {
        using var db = await dataSource.OpenConnectionAsync();
        using var transaction = await db.BeginTransactionAsync();

        try
        {
            // 1. Считаем итоговую сумму на сервере (для безопасности)
            // В реальном проекте это лучше делать в Service, но для примера через SQL:
            const string pizzaPriceSql = @"
                SELECT price FROM pizza_variants 
                WHERE pizza_id = @PizzaId AND size = @Size::pizza_size";

            decimal totalOrderPrice = 0;
            var itemsWithPrices = new List<dynamic>();

            foreach (var item in dto.Items)
            {
                var price = await db.QuerySingleAsync<decimal>(pizzaPriceSql, 
                    new { item.PizzaId, Size = item.Size.ToString() }, transaction);
                
                totalOrderPrice += price * item.Count;
                itemsWithPrices.Add(new { 
                    PizzaId = item.PizzaId, 
                    Size = item.Size.ToString(), 
                    item.Count, 
                    Price = price 
                });
            }

            // 2. Вставляем сам заказ
            const string orderSql = @"
                INSERT INTO orders (customer_id, delivery_type, address, total_price, history)
                VALUES (@CustomerId, @DeliveryType::delivery_type, @Address, @TotalPrice, @History::jsonb)
                RETURNING id";

            // Начальная история заказа
            var initialHistory = JsonSerializer.Serialize(new[] {
                new { status = "new", label = "Принят", time = DateTime.Now.ToString("HH:mm"), updatedBy = "Система" }
            });

            var orderId = await db.ExecuteScalarAsync<int>(orderSql, new {
                dto.CustomerId,
                dto.DeliveryType,
                dto.Address,
                TotalPrice = totalOrderPrice,
                History = initialHistory
            }, transaction);

            // 3. Вставляем позиции заказа
            const string itemsSql = @"
                INSERT INTO order_items (order_id, pizza_id, size, count, price_at_purchase)
                VALUES (@OrderId, @PizzaId, @Size::pizza_size, @Count, @Price)";

            await db.ExecuteAsync(itemsSql, itemsWithPrices.Select(i => new {
                OrderId = orderId,
                i.PizzaId,
                i.Size,
                i.Count,
                i.Price
            }), transaction);

            await transaction.CommitAsync();
            return orderId;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<OrderEntity?> GetByIdAsync(int id)
    {
        using var db = await dataSource.OpenConnectionAsync();
        
        const string sql = @"
            SELECT 
                o.id,
                o.created_at AS CreatedAt,
                o.delivery_type::text AS DeliveryType,
                o.address,
                o.status::text,
                o.history AS HistoryJson,
                o.total_price AS TotalPrice,
                c.name AS CustomerName,
                c.phone AS CustomerPhone,
                co.name AS CourierName,
                (SELECT json_agg(json_build_object(
                    'pizzaId', oi.pizza_id,
                    'pizzaName', p.name,
                    'size', oi.size,
                    'count', oi.count,
                    'price', oi.price_at_purchase
                )) 
                FROM order_items oi 
                JOIN pizzas p ON p.id = oi.pizza_id 
                WHERE oi.order_id = o.id) AS ItemsJson
            FROM orders o
            JOIN customers c ON c.id = o.customer_id
            LEFT JOIN couriers co ON co.id = o.courier_id
            WHERE o.id = @id";

        return await db.QueryFirstOrDefaultAsync<OrderEntity>(sql, new { id });
    }

    public async Task<bool> UpdateStatusAsync(int id, string newStatus, string label, string updatedBy)
    {
        using var db = await dataSource.OpenConnectionAsync();
        
        // Подготавливаем новый объект истории
        var newHistoryEntry = JsonSerializer.Serialize(new[] {
            new { 
                status = newStatus, 
                label = label, 
                time = DateTime.Now.ToString("HH:mm"), 
                updatedBy = updatedBy 
            }
        });

        const string sql = @"
            UPDATE orders 
            SET 
                status = @newStatus::order_status,
                history = history::jsonb || @newHistoryEntry::jsonb
            WHERE id = @id";

        var affectedRows = await db.ExecuteAsync(sql, new { 
            id, 
            newStatus, 
            newHistoryEntry 
        });

        return affectedRows > 0;
    }
}