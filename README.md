🍕 Pizza Manager

Fullstack-проект для демонстрации навыков разработки

Данный проект создан как часть портфолио для демонстрации компетенций в проектировании и реализации современных Fullstack-приложений. Это не конечный коммерческий продукт, а техническая витрина, показывающая подход к архитектуре, чистоте кода и использованию актуального стека технологий.

🚀 Основной стек

-   Backend: .NET 10 (C#), Dapper, PostgreSQL, DbUp (миграции).
-   Frontend: Angular 21, Tailwind CSS 4, Lucide Icons.
-   Testing: xUnit, FluentAssertions, Moq, Testcontainers (PostgreSQL).
-   Infrastructure: Docker, Docker Compose.
-   API Documentation: Scalar (вместо классического Swagger).

🏗 Архитектура проекта

Проект разделен на три ключевые части, находящиеся в соответствующих директориях:

1.  `PizzaManagerApi/` --- RESTful API на базе ASP.NET Core. Использует легковесный Dapper для работы с БД и DbUp для автоматического наката SQL-миграций при старте.
2.  `PizzaManagerTests/` --- Интеграционные и модульные тесты. Главная особенность --- использование Testcontainers, что позволяет запускать тесты в реальном окружении PostgreSQL внутри Docker.
3.  `PizzaManagerFront/` --- Современное SPA на Angular 21 с использованием новой версии Tailwind CSS 4 и типизированных иконок Lucide.

🛠 Запуск проекта

Для запуска всего окружения (База данных + API + Frontend) достаточно установленного Docker и одной команды:

bash

```
docker-compose up --build

```

После запуска сервисы будут доступны по следующим адресам:

-   Frontend: http://localhost
-   API / Scalar UI: http://localhost:8080/scalar/v1
-   Database: `localhost:5432` (User: `postgres`, Pass: `admin`)

💡 Ключевые особенности

-   Bleeding Edge: Использование NET 10 и Angular 21 демонстрирует готовность работать с новейшими стандартами индустрии.
-   Infrastructure as Code: Вся среда разработки и деплоя описана в `docker-compose.yml`.
-   Reliability: Покрытие тестами с использованием контейнеризации БД гарантирует стабильность работы миграций и запросов.
-   Modern UI: Интерфейс построен на Tailwind 4, обеспечивающем высокую производительность и гибкость стилизации.