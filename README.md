Vehicle Service Platform 🚗
Мікросервісна платформа для управління користувачами та транспортними засобами з автоматичною синхронізацією через RabbitMQ.

📋 Огляд
Цей проєкт складається з трьох основних компонентів:

User Service - мікросервіс для управління користувачами

Vehicle Service - мікросервіс для управління транспортними засобами

Frontend - React додаток для взаємодії з сервісами

RabbitMQ - брокер повідомлень для міжсервісної комунікації

🛠 Технологічний стек
Backend
Node.js + NestJS + TypeScript

PostgreSQL (окрема база для кожного сервісу)

RabbitMQ для міжсервісної комунікації

Docker та Docker Compose

Frontend
React + TypeScript

Vite для збірки

Axios для HTTP запитів

🚀 Швидкий старт
Передумови
Docker Desktop

Node.js 18+ (для локальної розробки)

Запуск проєкту
# Клонування репозиторію (якщо потрібно)
git clone <repository-url>
cd vehicle-platform

# Запуск всіх сервісів
docker compose up --build

# Запуск у фоновому режимі
docker compose up --build -d
📊 Доступ до сервісів
Після успішного запуску сервіси будуть доступні за наступними адресами:

Сервіс	URL	Порт
Frontend	http://localhost:3000	3000
User Service API	http://localhost:3001	3001
Vehicle Service API	http://localhost:3002	3002
RabbitMQ Management	http://localhost:15672	15672
Credentials для RabbitMQ:

Username: guest
Password: guest

🛠 Корисні команди для роботи з проєктом
Основні команди Docker Compose
# Запуск всіх сервісів
docker compose up --build

# Запуск у фоновому режимі
docker compose up -d

# Зупинка всіх сервісів
docker compose down

# Очистити всі образи, контейнери та volumes
docker system prune -f

# Або тільки очистити образи нашого проекту
docker compose down --rmi all

# Перезапуск всіх сервісів
docker compose restart

# Перегляд статусу сервісів
docker compose ps

# Оновлення сервісів після змін у коді
docker compose up --build -d
Перегляд логів
# Перегляд логів всіх сервісів
docker compose logs -f

# Перегляд логів конкретного сервісу
docker compose logs -f user-service
docker compose logs -f vehicle-service
docker compose logs -f frontend
docker compose logs -f rabbitmq

# Перегляд логів бази даних
docker compose logs -f user-db
docker compose logs -f vehicle-db

Управління окремими сервісами
# Перезапуск конкретного сервісу
docker compose restart user-service
docker compose restart vehicle-service

# Зупинка конкретного сервісу
docker compose stop user-service

# Запуск конкретного сервісу
docker compose start user-service

# Перебудова конкретного сервісу
docker compose up --build user-service

Робота з базою даних
# Підключення до бази даних User Service
docker exec -it user-db psql -U postgres -d user_db

# Підключення до бази даних Vehicle Service  
docker exec -it vehicle-db psql -U postgres -d vehicle_db
🧪 Тестування роботи системи
Крок 1: Перевірка RabbitMQ
Відкрийте RabbitMQ Management Console: http://localhost:15672

Увійдіть з обліковими даними: guest/guest

Перевірте, що створилися черги та exchange:

Exchange: user_events

Queue: vehicle_service_queue

Крок 2: Створення користувача
Через Frontend:

Відкрийте http://localhost:3000

Перейдіть на сторінку "Users"

Заповніть форму створення користувача

Натисніть "Create User"

Через API (Postman):

http
POST http://localhost:3001/users
Content-Type: application/json

{
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
Крок 3: Перевірка автоматичного створення транспортного засобу
Після створення користувача система автоматично створить "порожній" транспортний засіб:

Перевірка через API:

http
GET http://localhost:3002/vehicles/user/1
Очікувана відповідь:

json
[
  {
    "id": 1,
    "make": "Unknown",
    "model": "Unknown",
    "year": null,
    "userId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
Крок 4: Перевірка зв'язку даних
Отримання користувача з його транспортними засобами:

http
GET http://localhost:3001/users/1
GET http://localhost:3002/vehicles/user/1
📚 API Endpoints
User Service (http://localhost:3001)
Method	Endpoint	Description
POST	/users	Створення користувача
GET	/users	Отримання всіх користувачів
GET	/users/:id	Отримання користувача за ID
PUT	/users/:id	Оновлення користувача
DELETE	/users/:id	Видалення користувача
Vehicle Service (http://localhost:3002)
Method	Endpoint	Description
POST	/vehicles	Створення транспортного засобу
GET	/vehicles	Отримання всіх транспортних засобів
GET	/vehicles/:id	Отримання транспортного засобу за ID
GET	/vehicles/user/:userId	Отримання ТЗ за користувачем
PUT	/vehicles/:id	Оновлення транспортного засобу
DELETE	/vehicles/:id	Видалення транспортного засобу
🗂 Структура проєкту
text
vehicle-platform/
├── user-service/          # User microservice
├── vehicle-service/       # Vehicle microservice  
├── frontend/             # React frontend
├── docker-compose.yml    # Docker composition
└── README.md            # Документація

🔧 Розробка та внесення змін
Локальна розробка

# Розробка User Service
cd user-service
npm install
npm run start:dev

# Розробка Vehicle Service  
cd vehicle-service
npm install
npm run start:dev

# Розробка Frontend
cd frontend
npm install
npm run dev

Оновлення залежностей
# Оновлення в конкретному сервісі
cd user-service
npm update

# Перебудова після оновлення залежностей
docker compose up --build

🐛 Вирішення проблем
Сервіси не запускаються
# Перевірка логів
docker compose logs

# Перевірка вільності портів
netstat -ano | findstr :3000

Проблеми з підключенням до бази даних
# Перезапуск бази даних
docker compose restart user-db vehicle-db

# Перевірка з'єднань
docker compose logs user-db

Проблеми з RabbitMQ
# Очищення черг (увага: видалить всі повідомлення)
docker compose restart rabbitmq

📄 Ліцензія
MIT License