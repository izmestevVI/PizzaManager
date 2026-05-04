# 1. Стадия сборки
# Замени 8.0 на свою версию .NET (например, 7.0 или 9.0), если она отличается
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Копируем файлы проектов
COPY ["PizzaManagerApi/PizzaManagerApi.csproj", "PizzaManagerApi/"]
COPY ["PizzaManagerApi.Tests/PizzaManagerApi.Tests.csproj", "PizzaManagerApi.Tests/"]

# Восстанавливаем зависимости
RUN dotnet restore "PizzaManagerApi/PizzaManagerApi.csproj"

# Копируем весь остальной код
COPY . .
WORKDIR "/src/PizzaManagerApi"

# Выполняем сборку и публикацию
RUN dotnet publish "PizzaManagerApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Стадия выполнения (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PizzaManagerApi.dll"]