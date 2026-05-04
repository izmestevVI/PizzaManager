# 1. Стадия сборки Angular
FROM node:20-alpine AS build
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники и собираем проект
COPY . .
RUN npm run build

# 2. Стадия Nginx
FROM nginx:alpine

# ВНИМАНИЕ: Замени "PizzaManagerFront" на реальное имя проекта из твоего angular.json
COPY --from=build /app/dist/pizza-manager/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]