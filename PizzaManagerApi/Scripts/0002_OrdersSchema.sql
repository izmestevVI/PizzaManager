-- 1. Справочники типов и статусов
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('new', 'cooking', 'on_delivery', 'completed', 'cancelled');
    CREATE TYPE delivery_type AS ENUM ('delivery', 'pickup');
    CREATE TYPE courier_status AS ENUM ('active', 'on_delivery', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Клиенты
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT
);

-- 3. Курьеры
CREATE TABLE IF NOT EXISTS couriers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    status courier_status DEFAULT 'active'
);

-- 4. Заказы (шапка заказа)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    courier_id INTEGER REFERENCES couriers(id),
    delivery_type delivery_type NOT NULL,
    address TEXT NOT NULL,
    status order_status DEFAULT 'new',
    total_price DECIMAL(12, 2) NOT NULL,
    history JSONB NOT NULL DEFAULT '[]', -- История статусов хранится как JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Позиции заказа (детализация)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    pizza_id INTEGER REFERENCES pizzas(id),
    size pizza_size NOT NULL,
    count INTEGER NOT NULL CHECK (count > 0),
    price_at_purchase DECIMAL(12, 2) NOT NULL -- Фиксируем цену на момент покупки!
);

-- Наполним тестовыми данными из твоего мока
INSERT INTO customers (name, phone, address) VALUES 
('Иван Иванов', '+7 (999) 123-45-67', 'ул. Пушкина, д. 10, кв. 5'),
('Ольга Смирнова', '+7 (999) 765-43-21', 'пр. Ленина, д. 25, кв. 112') ON CONFLICT DO NOTHING;

INSERT INTO couriers (name, phone, status) VALUES 
('Алексей', '+7 (900) 111-22-33', 'active'),
('Дмитрий', '+7 (900) 444-55-66', 'on_delivery') ON CONFLICT DO NOTHING;
