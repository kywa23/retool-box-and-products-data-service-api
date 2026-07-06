-- Виправлення типу поля priority
-- Дата: 2026-07-06
-- Проблема: API падає з помилкою "invalid input syntax for type integer: \"4.1\""
-- Причина: priority має тип INTEGER, але потрібні десяткові значення для правильного сортування
-- Рішення: Змінити тип на NUMERIC з явною конвертацією через USING

-- Показати поточний стан
SELECT
  sku,
  name,
  priority,
  delivery_type
FROM boxes
ORDER BY priority;

-- Змінити тип поля priority з INTEGER на NUMERIC з явною конвертацією
ALTER TABLE boxes
ALTER COLUMN priority TYPE NUMERIC(10, 2) USING priority::NUMERIC(10, 2);

-- Тепер оновлюємо УкрПошта коробки на десяткові значення
UPDATE boxes SET priority = 4.1, updated_at = CURRENT_TIMESTAMP WHERE sku = '23459505202';
UPDATE boxes SET priority = 15.1, updated_at = CURRENT_TIMESTAMP WHERE sku = '23459505210';
UPDATE boxes SET priority = 20.1, updated_at = CURRENT_TIMESTAMP WHERE sku = '23459505220';
UPDATE boxes SET priority = 21.1, updated_at = CURRENT_TIMESTAMP WHERE sku = '23459505230';
UPDATE boxes SET priority = 22.1, updated_at = CURRENT_TIMESTAMP WHERE sku = '23459505215';

-- Перевірка типу після зміни
SELECT
  column_name,
  data_type,
  numeric_precision,
  numeric_scale
FROM information_schema.columns
WHERE table_name = 'boxes' AND column_name = 'priority';

-- Показати результат відсортований
SELECT
  sku,
  name,
  priority,
  delivery_type
FROM boxes
ORDER BY priority;

-- Статистика
SELECT
  '=== Статистика після виправлення ===' as info,
  COUNT(*) as total_boxes,
  MIN(priority) as min_priority,
  MAX(priority) as max_priority,
  COUNT(CASE WHEN priority::text LIKE '%.%' THEN 1 END) as decimal_priorities
FROM boxes;
