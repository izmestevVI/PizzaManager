-- 1. Создаем ENUM для размеров пиццы
-- Используем проверку, чтобы скрипт был идемпотентным (не падал при повторном запуске)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pizza_size') THEN
        CREATE TYPE pizza_size AS ENUM ('S', 'M', 'L');
    END IF;
END $$;

-- 2. Основная таблица пицц
CREATE TABLE IF NOT EXISTS pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT
);

-- 3. Варианты пицц (размеры, цены)
CREATE TABLE IF NOT EXISTS pizza_variants (
    id SERIAL PRIMARY KEY,
    pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE,
    size pizza_size NOT NULL,
    weight INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    in_stock BOOLEAN DEFAULT true
);

-- 4. Справочник категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 5. Связь пицц и категорий (многие ко многим)
CREATE TABLE IF NOT EXISTS pizza_categories (
    pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (pizza_id, category_id)
);

-- 6. Справочник ингредиентов
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 7. Связь пицц и ингредиентов (многие ко многим)
CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (pizza_id, ingredient_id)
);

-- Наполним справочники начальными данными для теста
INSERT INTO categories (name) VALUES ('Мясная'), ('Острая'), ('Веган'), ('Сырная') ON CONFLICT DO NOTHING;
INSERT INTO ingredients (name) VALUES ('Моцарелла'), ('Пепперони'), ('Томаты'), ('Грибы') ON CONFLICT DO NOTHING;
