-- Міграція: Додавання поля delivery_type до таблиці boxes
-- Дата: 2026-07-02
-- Опис: Додає ENUM тип box_delivery_type та поле delivery_type для фільтрації коробок за типом доставки

-- Створюємо ENUM тип для типу доставки коробки
CREATE TYPE box_delivery_type AS ENUM (
  'ukrposhta_only',     -- Тільки для Укрпошти (включаючи зовнішню ТТН)
  'novaposhta_only',    -- Тільки для Нової Пошти та інших (крім Укрпошти)
  'universal'           -- Універсальна коробка для всіх типів доставки
);

-- Додаємо поле delivery_type до таблиці boxes
ALTER TABLE boxes
ADD COLUMN delivery_type box_delivery_type DEFAULT 'universal';

-- Додаємо коментар
COMMENT ON COLUMN boxes.delivery_type IS 'Тип доставки, для якої призначена коробка: ukrposhta_only, novaposhta_only, universal';

-- Створюємо індекс для швидкого фільтрування
CREATE INDEX idx_boxes_delivery_type ON boxes(delivery_type);

-- Оновлюємо існуючі записи (якщо потрібно)
-- За замовчуванням всі існуючі коробки будуть 'universal'
-- Якщо треба змінити конкретні коробки, додай UPDATE запити:
--
-- UPDATE boxes SET delivery_type = 'ukrposhta_only' WHERE sku IN ('BOX_UKR_10', 'BOX_UKR_20');
-- UPDATE boxes SET delivery_type = 'novaposhta_only' WHERE sku IN ('BOX_NP_SPECIAL');
