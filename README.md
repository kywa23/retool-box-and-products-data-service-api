# Retool Box and Products Data Service API

API сервіс для отримання даних про товари та коробки з PostgreSQL БД.

## 🚀 Встановлення

```bash
npm install
```

## ⚙️ Налаштування

1. Скопіюйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Заповніть змінні в `.env`:
```env
PORT=3001
DATABASE_URL=postgresql://username:password@host:port/database
API_KEY=your_secret_api_key_here
```

## 📡 Запуск

### Режим розробки (з автоматичним перезапуском):
```bash
npm run dev
```

### Продакшн:
```bash
npm start
```

## 🔌 API Endpoints

### Загальна інформація
- `GET /` - інформація про API
- `GET /health` - перевірка статусу

### Товари

#### Отримати всі товари
```
GET /api/products
```

Відповідь:
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "sku": "SKU123",
      "name": "Товар 1",
      "weight_g": 500,
      "length_mm": 200,
      "width_mm": 150,
      "height_mm": 100,
      "photo": "url",
      "additional_sku": "ALT123",
      "packaging": "Стандартна",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Отримати розміри товарів (для box sizer)
```
GET /api/products/sizes
```

Відповідь у форматі Google Sheets (для сумісності):
```json
{
  "success": true,
  "count": 100,
  "data": [
    ["SKU123", 500, 200, 150, 100],
    ["SKU456", 300, 180, 120, 80]
  ]
}
```

#### Отримати товар(и) за артикулом
```
GET /api/products/by-sku?skus=SKU123
GET /api/products/by-sku?skus=SKU123,SKU456,SKU789
```

Відповідь:
```json
{
  "success": true,
  "count": 2,
  "data": ["..."]
}
```

### Коробки

#### Отримати всі коробки
```
GET /api/boxes
```

Відповідь (формат сумісний з Google Sheets):
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "name": "Маленька",
      "dimensions": {
        "length": 20,
        "width": 15,
        "height": 10
      },
      "weightLimit": 2,
      "prices": {
        "novaPoshta": 50,
        "ukrPoshta": 40
      },
      "priority": 0,
      "sku": "BOX_S"
    }
  ]
}
```

**Примітка:** Якщо таблиця `boxes` ще не створена, API поверне:
```json
{
  "success": false,
  "error": "Boxes table not created yet",
  "fallback": "Use Google Sheets as data source"
}
```

## 🔐 Аутентифікація

Якщо в `.env` встановлено `API_KEY`, потрібно передавати його в запитах:

### Через заголовок (рекомендовано):
```bash
curl -H "X-API-Key: your_secret_api_key_here" http://localhost:3001/api/products
```

### Через query параметр:
```bash
curl http://localhost:3001/api/products?api_key=your_secret_api_key_here
```

## 🗄️ SQL для створення таблиці boxes (коли буде потрібно)

```sql
CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  length_cm NUMERIC(10, 2) NOT NULL,
  width_cm NUMERIC(10, 2) NOT NULL,
  height_cm NUMERIC(10, 2) NOT NULL,
  weight_limit_kg NUMERIC(10, 2) NOT NULL,
  price_nova_poshta NUMERIC(10, 2),
  price_ukr_poshta NUMERIC(10, 2),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_boxes_sku ON boxes(sku);
```

## 🧪 Тестування

```bash
# Перевірка статусу
curl http://localhost:3001/health

# Отримати всі товари
curl http://localhost:3001/api/products

# Отримати розміри (для box sizer)
curl http://localhost:3001/api/products/sizes

# Отримати товар за SKU
curl http://localhost:3001/api/products/by-sku?skus=SKU123

# Отримати коробки
curl http://localhost:3001/api/boxes
```

## 📦 Структура проекту

```
retool-box-and-products-data-service-api/
├── config/
│   └── database.js          # Конфігурація PostgreSQL
├── middleware/
│   └── auth.js              # API Key аутентифікація
├── routes/
│   ├── products.js          # Endpoints для товарів
│   └── boxes.js             # Endpoints для коробок
├── .env                     # Змінні оточення (не в git)
├── .env.example             # Приклад змінних
├── .gitignore
├── package.json
├── server.js                # Головний файл
└── README.md
```

## 🔧 Технології

- **Express.js** - веб-фреймворк
- **pg** - PostgreSQL клієнт
- **cors** - CORS middleware
- **morgan** - HTTP логування
- **dotenv** - змінні оточення
